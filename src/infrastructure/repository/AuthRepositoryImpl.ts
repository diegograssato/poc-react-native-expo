import { AuthModel } from '../../domain/models/auth/AuthModel'
import { ResponseModel } from './models/ResponseModel'
import { UnauthorizedError } from './errors/auth/UnauthorizedError'
import { APIError } from './errors/APIError'
import { AuthRepository } from '../../domain/ports/AuthRepository'
import { getCookie } from '../../utils/utils'
 

export default class AuthRepositoryImpl implements AuthRepository {

  URL_LOCATION_TRACKING = 'https://dtux-lab-19.free.beeceptor.com';

  public login = async (
    user: string,
    password: string
  ): Promise<any> => {
    try {
      //url: `${process.env.REACT_APP_API_URL}/login`,
      console.log("[AuthRepositoryImpl] Login")
      let url = `${this.URL_LOCATION_TRACKING}?user=${user}&password=${password}`;
      const data: any = await fetch(url);

      
      return data;
      throw new UnauthorizedError()
    } catch (err: any) {
      throw AuthRepositoryImpl.getError(err)
    }
  }

  

  private static getError(err: any) {
    const typeErrors: any = {
      401: new UnauthorizedError(),
      404: new APIError(err.message),
      500: new APIError(err.response.data.message),
    }
    if (err.response.status === 404 && err.response.data !== '') {
      return new APIError(err.response.data.message)
    }
    return typeErrors[err.response.status]
  }
}
