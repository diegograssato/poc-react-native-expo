import { APIError } from '../APIError'

export class UnauthorizedError extends APIError {
  constructor(message?: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
