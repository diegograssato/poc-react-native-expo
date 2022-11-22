import store from '../redux/store'

import { AuthModel } from '../../domain/models/auth/AuthModel'
import { ErrorModel } from '../models/ErrorModel'
import { UnauthorizedError } from '../repository/errors/auth/UnauthorizedError'
import { AuthUseCase } from '../../domain/useCase/AuthUseCase'
import { base64Encode } from '../../utils/utils'


export default class AuthController {
  
  async login(
    login: string,
    password: string
  ): Promise<any> {
    try {
      const auth = new AuthUseCase()
      console.log("[AuthController] Login")
      // const userBase64 = base64Encode(login)
      // const passwordBase64 = base64Encode(password)
       const loginEncoded = await auth.login(login, password)
      
      return auth
    } catch (err: any) {
      if (err instanceof UnauthorizedError) {
        return new ErrorModel('Sem autorização')
      }
      return new ErrorModel(err.message || 'Error loading BFF')
    }
  }

   
}
