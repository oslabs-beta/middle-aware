import { ObjectId } from 'mongoose'

export type StringObject = {
  [key: string]: string;
}

export interface Details {
  routeId?: string
  lastTest?: any
}

export type TestRequest = {
  method?: string
  route?: string | undefined
  params?: any
  query?: any
  body?: any
 }

export interface Payload {
  testId: any
  request: {
    method?: string
    route?: string | undefined
    params?: any
    query?: any
    body?: any
  }
  response: {
    body?: string
    status_code?: number | undefined
  }
  response_time?: string
}

export interface TestType {
  route?: string
  created_at: number
  request?: {
    method?: string
    route?: string | undefined
    params?: any
    query?: any
    body?: any// json
}
response: {
  body?: any
  status_code?: number | undefined
}
middleware?: string[]
error?: boolean
response_time?: string
}

export interface RouteType {
  detail: string;
  last_test: any;
}
