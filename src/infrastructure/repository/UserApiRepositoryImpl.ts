import { UnauthorizedError } from './errors/auth/UnauthorizedError'
import { APIError } from './errors/APIError'
 

export default class UserApiRepositoryImpl {
  
  public getApiKey = async (token: string): Promise<any> => {
    try {
      console.log(`[UserApiRepositoryImpl] get API_KEY ${token}`);

      let url = "http://10.22.0.56:3000/token";
       
      return await fetch(url);

    } catch (err: any) {
      throw UserApiRepositoryImpl.getError(err);
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
