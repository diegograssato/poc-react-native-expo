import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import ApiKeyRepositoryImpl from '../../infrastructure/repository/ApiKeyRepositoryImpl';
import LocationTrackingRepositoryImpl from '../../infrastructure/repository/LocationTrackingRepositoryImpl';
import { PositionMapper } from '../../infrastructure/repository/mapper/PositionMapper';
import SessionRepositoryImpl from '../../infrastructure/repository/SessionRepositoryImpl';
import UserApiRepositoryImpl from '../../infrastructure/repository/UserApiRepositoryImpl';
import { LocationTrackingRepository } from '../ports/LocationTrackingRepository';
import { Position } from '../position/Position';
import { TrackingUseCase } from './TrackingUseCase';

export class VuuptSenderUsecase {
  repository: LocationTrackingRepository;
  userRepository: UserApiRepositoryImpl;
  sessionRepository: SessionRepositoryImpl;
  apiRepo: ApiKeyRepositoryImpl;

  constructor() {
    this.repository = new LocationTrackingRepositoryImpl();
    this.apiRepo = new ApiKeyRepositoryImpl();
    this.userRepository = new UserApiRepositoryImpl();
    this.sessionRepository = new SessionRepositoryImpl();
  }

  async send(position: Position): Promise<any> {
    /**
     * Fazer model
     */
    let requestApiKey: any = await this.apiRepo.get();

    if (!requestApiKey) {
      const responseWebApp = await this.sessionRepository.get();

      requestApiKey = await this.userRepository
        .getApiKey(responseWebApp.data.token)
        .then((response) => response.json());

      console.log(
        '[VuuptSenderUsecase] Opa tenho que buscar o token do usuário pq não existe na sessão'
      );
      await this.apiRepo.save(requestApiKey);
    }

    console.log(JSON.stringify(requestApiKey));
    console.log(`[VuuptSenderUsecase] - send - ${requestApiKey.apiKey}`);
    const formData = PositionMapper.toPosition(position).toEncodeURI();
    this.repository.tracking(requestApiKey.apiKey, formData);
    //await this.apiRepo.remove();
  }
}
