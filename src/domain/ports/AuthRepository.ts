import { AuthModel } from '../models/auth/AuthModel'

export interface AuthRepository {
  login(user: string, password: string): Promise<AuthModel>
}
