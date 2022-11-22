export class APIError extends Error {
  data: any

  constructor(message?: string, data?: any) {
    super(message)
    this.name = 'APIError'
    this.data = data
  }
}
