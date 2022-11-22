import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import IntegrationRepositoryImpl from '../../infrastructure/repository/IntegrationRepositoryImpl';
import LocationTrackingRepositoryImpl from '../../infrastructure/repository/LocationTrackingRepositoryImpl';
import { PositionMapper } from '../../infrastructure/repository/mapper/PositionMapper';
import SessionRepositoryImpl from '../../infrastructure/repository/SessionRepositoryImpl';
import UserApiRepositoryImpl from '../../infrastructure/repository/UserApiRepositoryImpl';
import IntegrationOptions from '../models/IntegrationOptions';
import { IntegrationType } from '../models/IntegrationType';
import { LocationTrackingRepository } from '../ports/LocationTrackingRepository';
import { Position } from '../position/Position';
import { IntegracaoError } from './error/IntegracaoError';
import { OtherTrackingUsecase } from './OtherTrackingUsecase';
import { TrackingUseCase } from './TrackingUseCase';
import { VuuptTrackingUsecase } from './VuuptTrackingUsecase';

const LOCATION_TRACKING = 'location-tracking';

export class IntegrationUseCase {
  trackingUseCase: TrackingUseCase;
  integrationOption: IntegrationOptions;

  constructor(integrationOption: IntegrationOptions) {
    this.integrationOption = integrationOption;

    switch (this.integrationOption.type) {
      case IntegrationType.Vuupt.toLocaleLowerCase():
        this.trackingUseCase = new VuuptTrackingUsecase('vuupt-location');
        break;

      case IntegrationType.Other.toLocaleLowerCase():
        this.trackingUseCase = new OtherTrackingUsecase('other-location');
        break;
      default:
        throw new IntegracaoError(
          `Integração não encontrada.- ${this.integrationOption.type}`
        );
    }
  }

  async getIntegration(): Promise<TrackingUseCase> {
    return this.trackingUseCase;
  }

  async start(): Promise<void> {
    console.log('start');
    await this.trackingUseCase.startTracking();
  }

  async stop(): Promise<void> {
    console.log('stop');
    await this.trackingUseCase.stopTracking();
  }

  async config(): Promise<void> {
    console.log('config');
    await this.trackingUseCase.config();
  }

  async define(): Promise<void> {
    console.log('define');
    await this.trackingUseCase.define();
  }
}
