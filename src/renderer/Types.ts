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
  openFile: () => Promise<string>;
  parseFiles: (dir: string) => Promise<string[]>;
  getAllRoutes: () => Promise<string>;
  // getRoute: (route: any) => any;
  getTest: (test: string) => Promise<string>;
}
