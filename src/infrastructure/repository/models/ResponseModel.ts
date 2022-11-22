export class MetaModel {
  requestTime: string

  totalRecords?: number

  totalPages?: number

  constructor(requestTime: string, totalRecords?: number, totalPages?: number) {
    this.requestTime = requestTime
    this.totalRecords = totalRecords
    this.totalPages = totalPages
  }
}

export class ResponseModel<T> {
  status: number

  message: string

  meta: MetaModel

  data?: T

  errors: boolean

  constructor(
    status: number,
    message: string,
    meta: MetaModel,
    errors: boolean,
    data?: any
  ) {
    this.status = status
    this.message = message
    this.data = data
    this.errors = errors
    this.meta = meta
  }
}
