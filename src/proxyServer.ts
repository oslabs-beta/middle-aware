// Importing modules, using the following:
//  1. http-proxy-middleware to create the proxy server
//  2. express to start the http server
//  3. dbController so we can integrate with the DB
import { IncomingHttpHeaders } from 'http'
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware'
import { Application, Request, Response, NextFunction } from 'express'
import dbController from './dbController'
import { Details, Payload, TestType, RouteType } from './Types'
import { performance } from 'perf_hooks'
const express = require('express')

// setup express server so that we can start the proxy server and disable etag
// etag needs to be disabled otherwise we will get 304 status code for frequent requests and the reponse body will not be captured
// startTime is declared here so that we can start the clock on the round trip time
const app = express()
app.set('etag', false)
let startTime: number
let endTime: number

type ModifiedOptions = Options & {
  onProxyReq: (proxyReq: any, req: Request, res: Response) => Promise<void>
}

// these options will be used in the proxy server, to help configure it
//  1. target is the server the proxied requests will be forwarded to
//  2. onProxyReq will allow us to handle the proxied request
//  3. onProxyRes will allow us to handle the proxied response
const options: ModifiedOptions = {
  target: 'http://localhost:5002', // Your target URL here
  onProxyReq: async (proxyReq, req, res) => {
    startTime = performance.now()
    // restream parsed body before proxying
    if (req.body) {
      const bodyData = JSON.stringify(req.body)
      // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
      proxyReq.setHeader('Content-Type', 'application/json')
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
      // stream the content
      proxyReq.write(bodyData)
    }
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
  const test = await dbController.updateTest(payload.testId, cache.routeId, payload)
  cache.lastTest = await dbController.getTest(payload.testId!)
  cache.lastTest = JSON.parse(cache.lastTest)[0]
  // getTest(testId)
  await dbController.updateRoute(cache)
}

const proxy = createProxyMiddleware(options)

// set custom header implimentation downhere vs up in option/onProxyreq
const setHeader = async (req: Request, res: Response, next: any): Promise<void> => {
  const { method, originalUrl, params, query, body } = req
  const test = await dbController.createTest({ method, originalUrl, params, query, body }) // passing in req object
  const testId = await test!._id.toString()
  req.headers['middle-aware-test-id'] = testId
  next()
}

// Proxy Server Route to handle all other requests (requests from user's frontend)
app.use(express.json()) // parsing incoming data from request body and making it available to req.body
app.use(express.urlencoded()) // parsing incoming URL-encoded form datafrom reqsuest body as well
// Middle-Aware Agent Route to store call stack tracing details
// this may need to be separated from the proxy server
app.put('/middleAwareAgent', async (req, res, next) => {
  // middleAwareTestID
  const { testId, functionName } = req.body
  // do I have to use default here? why am I required here but not elsewhere?
  await dbController.addFuncNameToTest(testId, functionName)
})
app.use('**', setHeader, proxy)

module.exports = app
