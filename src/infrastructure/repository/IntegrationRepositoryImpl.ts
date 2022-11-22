import { AuthModel } from '../../domain/models/auth/AuthModel'
import { ResponseModel } from './models/ResponseModel'
import { UnauthorizedError } from './errors/auth/UnauthorizedError'
import { APIError } from './errors/APIError'
import { LocationTrackingRepository } from '../../domain/ports/LocationTrackingRepository'
import { PositionModel } from './models/PositionModel'
import IntegrationStoreRepositoryImpl from './IntegrationStoreRepositoryImpl'

export default class IntegrationRepositoryImpl {
  integratitonStore: IntegrationStoreRepositoryImpl;

  constructor(){
    this.integratitonStore = new IntegrationStoreRepositoryImpl();
  }
  public getIntegration = async (): Promise<any> => {
    try {

      console.log('[IntegrationRepositoryImpl] tracking');
      let url = `http://10.22.0.56:3000/integration`;

      return await fetch(url)
 
    } catch (err: any) {
      throw IntegrationRepositoryImpl.getError(err);
    }
  };

  private static getError(err: any) {
    const typeErrors: any = {
      401: new UnauthorizedError(),
      404: new APIError(err.message),
      500: new APIError(err.response.data.message),
    };
    if (err.response.status === 404 && err.response.data !== '') {
      return new APIError(err.response.data.message);
    }
    return typeErrors[err.response.status];
  }
}
