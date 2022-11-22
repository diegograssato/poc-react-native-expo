import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Position } from '../position/Position';
import { TrackingUseCase } from './TrackingUseCase';
import { VuuptSenderUsecase } from './VuuptSenderUsecase';

export class VuuptTrackingUsecase implements TrackingUseCase {
  senderUserCase: VuuptSenderUsecase;
  locationTracking: string;

  constructor(tracking: string) {
    this.senderUserCase = new VuuptSenderUsecase();
    this.locationTracking = tracking;
  }

  /**
   * Inicializa a configuração tanto das permissões
   * necessárias para obtenção da geolocalização
   * e também da task de execução
   */
  async config(): Promise<any> {
       console.log(
         `[VuuptTrackingUsecase] - config - ${this.locationTracking}`
       );
    let resf = await Location.requestForegroundPermissionsAsync();
    let resb = await Location.requestBackgroundPermissionsAsync();
    if (resf.status != 'granted' && resb.status !== 'granted') {
      console.log('Permission to access location was denied');
    }else{
      console.log('Permission to access location its okay');
    }
  }

  async define() {
    console.log(
      `[VuuptTrackingUsecase] - define - ${this.locationTracking}`
    );

    const isDefined = await TaskManager.isTaskDefined(this.locationTracking);

    if (isDefined) {
      return;
    }

    TaskManager.defineTask(
      this.locationTracking,
      async ({ data: { locations }, error }) => {
        if (error) {
          console.log('LOCATION_TRACKING task ERROR:', error);
          return;
        }

        if (locations && locations.length > 0) {
          var position: Position = [...locations].shift();

          console.log(
            `${new Date(Date.now()).toLocaleString()}: ${
              position.coords.latitude
            },${position.coords.longitude}`
          );

          await this.senderUserCase.send(position);
          
          
        }
      }
    );
  }

  async hasStartedLocation(): Promise<Boolean> {
    console.log(
      `[VuuptTrackingUsecase] - hasStartedLocation - ${this.locationTracking}`
    );
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      this.locationTracking
    );

    console.log('tracking started?', hasStarted);
    return hasStarted;
  }

  async startTracking(): Promise<any> {
    console.log(
      `[VuuptTrackingUsecase] - startTracking - ${this.locationTracking}`
    );

    await Location.startLocationUpdatesAsync(this.locationTracking, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
      foregroundService: {
        notificationColor: '#009edb',
        notificationTitle: 'Usando sua localização em tempo real',
        notificationBody:
          'Para desligar, volte ao aplicativo e desligue alguma coisa.',
      },
    });
  }

  async stopTracking(): Promise<any> {
    TaskManager.isTaskRegisteredAsync(this.locationTracking).then(
      (tracking) => {
        if (tracking) {
          Location.stopLocationUpdatesAsync(this.locationTracking);
        }
      }
    );
  }
}
