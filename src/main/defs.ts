import { ObjectId } from 'mongoose'

export interface Details {
  routeId?: string
  testId?: string
}

export interface Payload {
  endpoint: string
  method: string
  body: string
  statusCode?: number
  roundTripTime: string
}

export interface TestType {
  route: string;
  created_at?: string;
  request?: string;
  response?: string;
  error?: string;
  rtt?: string;
}

export interface RouteType {
  detail: string;
  input: string;
  middleware?: string;
  last_test_id: TestType | null;
}
