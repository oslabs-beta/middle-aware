// Importing modules, using the following:
//  1. http-proxy-middleware to create the proxy server
//  2. express to start the http server
//  3. dbController so we can integrate with the DB
import { IncomingHttpHeaders } from 'http'
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware'
import * as express from 'express'
import { Application, Request, Response, NextFunction } from 'express'
import dbController from '../src/main/dbController'
import { Details, Payload, TestType, RouteType } from '../src/main/defs'
import { performance } from 'perf_hooks'

// setup express server so that we can start the proxy server and disable etag
// etag needs to be disabled otherwise we will get 304 status code for frequent requests and the reponse body will not be captured
// startTime is declared here so that we can start the clock on the round trip time
const app = express()
app.set('etag', false)
let startTime: number
let endTime: number

// export interface CustomRequest extends Request {
//   foo?: string;
//   bar?: number;
// }  maybe customize our Request object?

type ModifiedOptions = Options & {
  onProxyReq: (proxyReq: any, req: Request, res: Response) => Promise<void>
}

// these options will be used in the proxy server, to help configure it
//  1. target is the server the proxied requests will be forwarded to
//  2. onProxyReq will allow us to handle the proxied request
//  3. onProxyRes will allow us to handle the proxied response

const options: ModifiedOptions = {
  target: 'http://localhost:3000', // Your target URL here
  onProxyReq: async (proxyReq, req, res) => {
    // create test document and intailze test to hold test document details, including objectId
    // objectId will be used for our UUID to relate request/response with call stack tracing details

    /*
    1. Initialize test document
    2. Grab object id for test document
    3. Add test document to request header
*/
    // const { method, route, params, query, body } = req
    // const route = dbController.getRoute()
    // const test = await dbController.createTest({ method, route, params, query, body }) // passing in req object
    // const testId = await test!._id.toString()
    // get testId back from mongo
    // proxyReq.setHeader('middleAwareTestID', testId)
    startTime = performance.now()
    console.log(JSON.stringify(req.headers))
    console.log('Hello from onProxyReq')
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
    proxyRes.on('end', async () => {
      endTime = performance.now()
      // console.log(`this is rr:${new Date().getTime() - startTime2}`)
      const response: string = Buffer.concat(body).toString('utf8')
      const payload: Payload = {
        testId: req.headers['middle-aware-test-id'],
        request: {
          method: req.method,
          route: req.url,
          params: req.params,
          query: req.query,
          body: req.body
        },
        response: {
          body: response,
          status_code: proxyRes.statusCode
        },
        response_time: `${endTime - startTime} ms`
      }
      console.log('reqest body in proxyRes.on:', req)
      console.log('data:', payload)
      // store the test and route data into mongoDB
      pushToDB(payload)

      // send the response back to the original client
      res.send()
    }
    )
  }
}

const pushToDB = async (payload: Payload): Promise<void> => {
  // cache will hold the testId and routeId as they are necessary to store the payload data

  const cache: Details = {}

  // if route document exists, then we will assign only the routeId to cache object
  // otherwise, we will create it, which will return the route document json, then assign only the routeId to cache object
  let route = await dbController.getRoute(`${payload.request.method} ${payload.request.route}`)
  if (route) {
  // check if route exists first
  // if so, will return the route document json

    // if route document exists, then we will assign only the routeId to cache object
    // otherwise, we will create it, which will return the route document json, then assign only the routeId to cache object

    cache.routeId = route._id.toString()
  } else {
    route = await dbController.createRoute(`${payload.request.method} ${payload.request.route}`)
    cache.routeId = route!._id.toString()
  }

  // Create test document which will return the test document json
  // Assign the document id to cache object
  // Cache wil be used to update last_test_id in related route document
  // const test = await dbController.createTest(cache.routeId, payload)
  cache.lastTest = dbController.getTest(payload.testId!)
  // getTest(testId)
  dbController.updateRoute(cache)
}

const proxy = createProxyMiddleware(options)

/*
	1. Should exist in its own route handler before the proxy route handler
	2. app.post('insert unique middleware endpoint')
	3. Middleware function should leverage updateTest to add to the middleware field by using the object id passed via request

*/
// Start server
app.put('/middleAwareAgent', express.urlencoded(), express.json(), async (req, res, next) => {
  // middleAwareTestID
  console.log('request body', req.body)
  const { testId, functionName } = req.body
  await dbController.addFuncNameToTest(testId, functionName)
})
// set custom header implimentation downhere vs up in option/onProxyreq
const setHeader = async (req, res, next) => {
  console.log(JSON.stringify(req.headers))
  const { method, originalUrl, params, query, body } = req
  console.log('route', route)
  const test = await dbController.createTest({ method, originalUrl, params, query, body }) // passing in req object
  const testId = await test!._id.toString()
  console.log('test', test)
  console.log('testId: ', testId)
  req.headers['middle-aware-test-id'] = testId
  next()
}

app.use('**', setHeader, proxy)

app.listen(9000, () => {
  console.log('Proxy server listening on port 9000')
})
