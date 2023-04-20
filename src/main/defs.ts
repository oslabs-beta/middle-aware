import { ObjectId } from 'mongoose'

export type StringObject = {
  [key: string]: string;
}

export interface Details {
  routeId?: string
  lastTest?: any
}

export interface Payload {
  endpoint: string
  method: string
  param: string
  query: string
  request: {
    method: string
    endpoint: string
    params: string
    query: string
    body: string
  }
  response_time: string
  error: boolean
  response: {
    body: string
    statusCode: number
  }

}

export interface TestType {
  route?: string
  created_at: number
  request?: {
    method?: string
    route?: string
    params?: string
    query?: string
    body?: any// json
}
response?: {
  status_code?: number
  body?: any
}
middleware?: string[]
error?: boolean
response_time?: string
}

// interface TestSchemaType extends Document<Types.ObjectId> {
//   route?: {
//     type: ObjectId
//     ref: string
//   }
//   created_at: number
//   request?: {
//     method?: string
//     route?: string
//     params?: string
//     query?: string
//     body?: any// json
// }
// response?: {
//   status_code?: number
//   body?: any
// }
// middleware?: string[]
// error?: boolean
// response_time?: string
// }

export interface RouteType {
  detail: string;
  last_test: any;
}
