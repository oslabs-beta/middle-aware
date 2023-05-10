import { ObjectId } from 'mongoose'

export type StringObject = {
  [key: string]: string;
}

export type HeaderProps = {
  config: () => void
  configStatus: boolean
  started: () => void
  instrument: () => void
}

export type FooterProps = {
  started: boolean
}

export interface Details {
  routeId?: string
  lastTest?: any
}

export type TestRequest = {
  method?: string
  originalUrl?: string | undefined
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

export interface Responses {
  _id: string,
  request: {
    method: string,
    endpoint: string
  },
  response: {
    message: string,
    payload: string,
    status_code: number
  },
  rtt: string,
  route_id: {
    type: string,
    ref: string
  }
}

export interface fetchCall {
  method: string,
  route: string,
  options: object
}

export type RouteProps = {
  id?: string;
  detail: string;
  method?: string;
  message?: string;
  available?: boolean;
  error?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined | any;
  response?: {
    status_code: number;
  }
}

export type statusColors = {
  error: string,
  good: string,
  default: string
}

export type ResultProps = {
  id: string;
 request: {
    method: string,
    endpoint: string
  };
  response: {
    message: string,
    payload: string,
    status_code: number
  };
  rtt: string;
  route_id?:string;
}

export type APIfuncs ={
  openFile: (fileOrDir: string) => Promise<string>;
  parseFiles: (dir: string) => Promise<fetchCall[]>;
  getAllRoutes: () => Promise<string>;
  // getRoute: (route: any) => any;
  getTest: (test: string) => Promise<string>;
  startFEParseAndServer: () => Promise<any>;
  copyConfig: (dir: string) => void;
  documentation: () => void;
  startInstrumentation: () => void;
}
