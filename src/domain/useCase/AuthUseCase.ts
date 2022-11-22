import { AuthRepository } from '../ports/AuthRepository'
import LocationTrackingRepositoryImpl from '../../infrastructure/repository/LocationTrackingRepositoryImpl'
import { AuthModel } from '../models/auth/AuthModel'
import { setCookie } from '../../utils/utils'

export class AuthUseCase {
  repository: AuthRepository
 

  constructor() {
    this.repository = new LocationTrackingRepositoryImpl()
  }

  async login(user: string, password: string): Promise<any> {
    const repositoryResponse = await this.repository.login(user, password)
    console.log("[AuthUseCase] Login")
    //await setCookie('token', repositoryResponse.token)
    //  if (position) {
    //   try {
    //     let baseURL = `${URL_LOCATION_TRACKING}?lat=${position.coords.latitude}&long=${position.coords.longitude}`;
    //     return await fetch(baseURL);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    return repositoryResponse;
  }
 
}
