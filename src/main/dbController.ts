// const { Test, Route } = require('./dbModels')
import { Test, Route } from './dbModels'
import mongoose from 'mongoose'
import { Details, Payload, TestType, RouteType } from './defs'

// interface ControllerConfig {
//   getAllRoutes: Function;
//   getRoute: Function;
//   createRoute: Function;
//   updateRoute: Function;
//   getTest: Function;
//   createTest: Function;
// }

// interface Test {
//   route: string;
//   created_at?: string;
//   request?: string;
//   response?: string;
//   error?: string;
//   rtt?: string;
// }

// interface Route {
//   detail: string;
//   input: string;
//   middleware?: string;
//   last_test: Test;
// }

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
      const route = await Route.findOneAndUpdate({ _id: obj.routeId }, { last_test_id: obj.testId })
      // route.last_test_id = obj.testId
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

  createTest: async (test: string, info: Payload) => {
    try {
      return await Test.create({
        route_id: test,
        created_at: Date.now(),
        request: {
          method: info.method,
          endpoint: info.endpoint
        },
        response: {
          status_code: info.statusCode,
          message: info.body,
          payload: ''
        },
        error: info.body, // we already capture the status code and message, is there anything else we want to capture here?
        rtt: info.roundTripTime
      })
    } catch (err) {
      console.log('Error in dbController.createTest: ', err)
    }
  }
}

export default dbController
