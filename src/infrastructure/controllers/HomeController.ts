import * as Location from 'expo-location';
import IntegrationOptions, {
  IntegrationOptionsMapper,
} from '../../domain/models/IntegrationOptions';
import { IntegrationType } from '../../domain/models/IntegrationType';

import { IntegrationUseCase } from '../../domain/useCase/IntegrationUseCase';
import { VuuptTrackingUsecase } from '../../domain/useCase/VuuptTrackingUsecase';
import IntegrationRepositoryImpl from '../repository/IntegrationRepositoryImpl';
import IntegrationStoreRepositoryImpl from '../repository/IntegrationStoreRepositoryImpl';
import SessionRepositoryImpl from '../repository/SessionRepositoryImpl';
import UserApiRepositoryImpl from '../repository/UserApiRepositoryImpl';

export default class HomeController {
  static integrationTracking: IntegrationUseCase;
  integracaoState: boolean = false;
  integratitonStore: IntegrationStoreRepositoryImpl;
  
  constructor() {
    this.integratitonStore = new IntegrationStoreRepositoryImpl();
  }

 

  async handleEvents(event: any): Promise<any> {
    console.log('\n[handleEvents]');

    /**
     * Salva os dados retornado pelo webApp
     */
    const responseWebApp = JSON.parse(event.nativeEvent.data);
    const sessionRepo = new SessionRepositoryImpl();
    await sessionRepo.save(responseWebApp);

    const integration = new IntegrationRepositoryImpl();
    let integrationBody: IntegrationOptions = await integration
      .getIntegration()
      .then((response) => response.json());
    await this.integratitonStore.save(integrationBody);
    // const integrationBody: IntegrationOptions =
    //   await this.integratitonStore.get();

      
    HomeController.integrationTracking = new IntegrationUseCase(
        integrationBody
      );
    if (!integrationBody.state) {
      console.log('Integração desativada 3');
      return;
    }
    await HomeController.integrationTracking.config();

    await HomeController.integrationTracking.define();
    switch (responseWebApp.event) {
      case 'onLogin':
        try {
          await HomeController.integrationTracking.start();
        } catch (e) {
          console.log(
            'Problema encontrado durante a tentativa de startar o processo de tracking'
          );
          console.log(e.message);
         
        }

        break;

      case 'onLogout':
        await HomeController.integrationTracking.stop();
        //rawait this.integratitonStore.remove();
        break;

      default:
        console.log(`Sorry, we are out of ${responseWebApp.event}.`);
    }
  }
}
