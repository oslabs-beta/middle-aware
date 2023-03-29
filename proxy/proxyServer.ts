// Importing modules, using the following:
//  1. http-proxy-middleware to create the proxy server
//  2. express to start the http server
//  3. dbController so we can integrate with the DB
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware'
import * as express from 'express'
import dbController from '../src/main/dbController'

interface Payload {
  endpoint: string
  method: string
  body: string
  statusCode?: number
  roundTripTime: string
}

interface Test {
  route?: string;
  created_at?: string;
  request?: string;
  response?: string;
  error?: string;
  rtt?: string;
}

  interface Route {
  _id?: string;
  input?: string;
  middleware?: string | undefined;
  last_test: Test;
}
// setup express server so that we can start the proxy server and disable etag
// etag needs to be disabled otherwise we will get 304 status code for frequent requests and the reponse body will not be captured
// startTime is declared here so that we can start the clock on the round trip time
const app = express()
app.set('etag', false)
let startTime: number

// these options will be used in the proxy server, to help configure it
//  1. target is the server the proxied requests will be forwarded to
//  2. onProxyReq will allow us to handle the proxied request
//  3. onProxyRes will allow us to handle the proxied response
const options: Options = {
  target: 'http://localhost:3000', // Your target URL here
  onProxyReq: (proxyReq, req, res) => {
    startTime = new Date().getTime()
  },
  onProxyRes: (proxyRes, req, res) => {
    // Modify the headers to prevent caching, specifically to avoid the 304 status code
    // Although we are disabling etag above, this is for good measure as we've inconsistent results with just disabling etag
    delete proxyRes.headers.etag
    delete proxyRes.headers['last-modified']
    proxyRes.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    proxyRes.headers.Pragma = 'no-cache' // for safari
    proxyRes.headers.Expires = '0'

    // Body will be chunks of data, especiall if it's a big payload
    // The array will allow us to capture the data in its entirety
    const body: Uint8Array[] = []

    // When the data event emitted by the proxied response, we will push each chunk of data to body
    proxyRes.on('data', (data) => {
      body.push(data)
    })

    // When the server has finished proxying the response, we will concatenate the response data into a human-readable encoding
    // This needs to be done as the data will not stop streaming until the end event is emitted
    // This is also where we can finalize the payload to be sent to the DB, as we need to wait for the response data
    proxyRes.on('end', () => {
      const response: string = Buffer.concat(body).toString('utf8')
      const payload: Payload = {
        endpoint: req.url,
        method: req.method,
        body: response,
        statusCode: proxyRes.statusCode,
        roundTripTime: `${new Date().getTime() - startTime} ms`
      }
      console.log('data:', payload)
      // store the test and route data into mongoDB
      pushToDB(payload)

      // send the response back to the original client
      res.send()
    })
  }
}

const pushToDB = async (payload: Payload): Promise<void> => {
  // cache will hold the testId and routeId as they are necessary to store the payload data

  interface Cache {
    routeId?: string
    testId?: string
  }

  const cache: Cache = {}

  // check if route exists first
  // if so, will return the route document json

  const route: Route = await dbController.getRoute(payload.endpoint)

  // if route document exists, then we will assign only the routeId to cache object
  // otherwise, we will create it, which will return the route document json, then assign only the routeId to cache object
  if (route) {
  // check if route exists first
  // if so, will return the route document json
    let route: Route = await dbController.getRoute(payload.endpoint)

    // if route document exists, then we will assign only the routeId to cache object
    // otherwise, we will create it, which will return the route document json, then assign only the routeId to cache object
    if (route) {
      cache.routeId = route._id
    } else {
      route = await dbController.createRoute(payload.endpoint)
      cache.routeId = route._id
    }

    // Create test document which will return the test document json
    // Assign the document id to cache object
    // Cache wil be used to update last_test_id in related route document
    const test = await dbController.createTest(cache.routeId, payload)
    cache.testId = test._id
    dbController.updateRoute(cache)
  }
}

const proxy = createProxyMiddleware(options)

// Start server
app.use('**', proxy)
app.listen(9000, () => {
  console.log('Proxy server listening on port 9000')
})
