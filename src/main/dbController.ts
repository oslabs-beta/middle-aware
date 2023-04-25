// const { Test, Route } = require('./dbModels')
import { Test, Route } from './dbModels'
import mongoose from 'mongoose'
import { Details, Payload, TestType, RouteType, StringObject, TestRequest } from './defs'

// interface ControllerConfig {

const dbController = {
  getAllRoutes: async () => {
    try {
      // return await JSON.stringify(models.Route.find({}))
      const allRoutes = await Route.find({})
      const allRoutesStringified = JSON.stringify(allRoutes)
      // console.log(allRoutesStringified)
      return allRoutesStringified
    } catch (err) {
      console.log('something: ', err)
    }
  },

  getRoute: async (route: string) => {
    // This function expects to receive a route / fetch resource. E.g.: "/api/user/" as a string
    try {
      // If an actual path was provided as string, search the route detail
      if (route.includes('/')) {
        return await Route.findOne({ detail: route }) // changed to findOne.
      } else {
        // otherwise assume a route _id was passed
        return await Route.findById({ _id: route }) // changed to findById.
      }
    } catch (err) {
      console.log('Error caught in dbController.getRoute: ', err)
    }
  },

  // find route
  updateRoute: async (obj: Details) => {
    try {
      const route = await Route.findOneAndUpdate({ _id: obj.routeId }, { last_test: obj.lastTest })
      return await route
    } catch (err) {
      console.log('Error in updateRoute in dbController', err)
    }
  },

  createRoute: async (route: string) => {
    try {
      return await Route.create({ detail: route })
    } catch (err) {
      console.log('Error in createRoute in dbController:', err)
    }
  },

  getTest: async (test: string) => {
    try {
      console.log('test id queried: ', test)
      const testData = await Test.find({ _id: test })
      const testDataStringified = JSON.stringify(testData)
      console.log(testDataStringified)
      return testDataStringified
    } catch (err) {
      console.log('Error caught in dbController.getTest: ', err)
    }
  },

  createTest: async (obj: TestRequest) => {
    try {
      console.log('obj', obj)
      const { method, originalUrl, params, query, body } = obj
      return await Test.create({
        request: {
          method,
          route: originalUrl,
          params,
          query,
          body
        }
      })
    } catch (err) {
      console.log('Error in dbController.createTest: ', err)
    }
  },

  updateTest: async (testId: string, routeId: string, info: Payload) => {
    try {
      console.log('updateTest args', [testId, routeId, info])
      return await Test.findOneAndUpdate({ _id: testId }, {
        route: routeId,
        created_at: Date.now(),
        request: {
          method: info.request.method,
          route: info.request.route,
          params: info.request.params,
          query: info.request.query,
          body: info.request.body
        },
        response: {
          status_code: info.response.status_code,
          body: info.response.body
        },
        // middleware: [],
        error: info.response.status_code! >= 400, // return true if stateCode is greater and euqal to 400, else , false
        response_time: info.response_time
      })
    } catch (err) {
      console.log('Error in dbController.updateTest: ', err)
    }
  },

  // Update Test document with middleware name inside Middlware property
  addFuncNameToTest: async (testId: string, funcName: string) => {
    try {
      return await Test.findOneAndUpdate({ _id: testId }, {
        $push: { middleware: funcName }
      })
    } catch (err) {
      console.log('Error in dbController.addFuncNameToTest: ', err)
    }
  }
}

export default dbController
