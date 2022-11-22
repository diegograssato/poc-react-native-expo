import { AuthModel } from '../../domain/models/auth/AuthModel'
import { ResponseModel } from './models/ResponseModel'
import { UnauthorizedError } from './errors/auth/UnauthorizedError'
import { APIError } from './errors/APIError'
import { LocationTrackingRepository } from '../../domain/ports/LocationTrackingRepository'
import { PositionModel } from './models/PositionModel'
 

export default class LocationTrackingRepositoryImpl implements LocationTrackingRepository {

  _API_INTEGRATION = 'https://sandbox.vuupt.com/api/v1';
  
  public tracking = async (apiKey:string, formData: string): Promise<any> => {
    try {
   
      console.log(`[LocationTrackingRepositoryImpl] tracking ${apiKey}`);
      let url = `${this._API_INTEGRATION}/agents/me/position`;
      
      const requestOptions = {
        method: 'PUT',
        headers: {
          Authorization: `${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formData,
      };
 
      const data: any = await fetch(url,requestOptions)
        .then(response => response.json())
        .then(data => console.log("Send tracking => " + JSON.stringify(data)));
     
      const URL_LOCATION_TRACKING = `https://dtux-lab-16.free.beeceptor.com/${formData}`;
      await fetch(URL_LOCATION_TRACKING);

    } catch (err: any) {
     return new APIError(err.message);
    }
  }
 
  private static getError(err: any) {
    const typeErrors: any = {
      401: new UnauthorizedError(),
      404: new APIError(err.message),
      500: new APIError(err),
    }
    if (err.response.status === 404 && err.response.data !== '') {
      return new APIError(err.response.data.message)
    }
    return typeErrors[err.response.status]
  }
}
