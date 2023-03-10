const models = require('./dbModels')

// interface dbController {
//   getAllRoutes: Function;
//   getRoute: Function;
//   getTest: Function;
// }

// interface Test {
//   route: string;
//   created_at?: string;
//   request?: string;
//   response?: string;
//   error?: string;
//   payload?: string;
// }

// interface Route {
//   detail: string;
//   input: string;
//   middleware?: string;
//   last_test: Test;
// }

// READ!: The following function and then statement allows you to view the data (in the console) on the front-end/Electron app
// const test = async () => {
//   const result = window.electronAPI.getAllRoutes();
//   return await result;
// }

// test().then((data) => console.log('this is our data: ', JSON.parse(data)));

const dbController = {
  getAllRoutes: async () => {
    try {
      // return await JSON.stringify(models.Route.find({}))
      const allRoutes = await models.Route.find({})
      const allRoutesStringified = JSON.stringify(allRoutes)
      console.log(allRoutesStringified)
      return allRoutesStringified
    } catch (err) {
      console.log('something: ', err)
    }
  },
  // return models.Route.find({})
  //   .then((data) => {
  //     return {
  //       ...data[0],
  //       _id: data[0]._id.toString(),
  //       last_test_id: data[0].last_test_id.toString()
  //     }
  //   })

  // try {
  //   // https://mongoosejs.com/docs/api.html#model_Model-find

  //   const queryResult = await models.Route.find({})
  //   // console.log(result[0]._id.toString())
  //   const result = await {
  //     ...queryResult,
  //     _id: queryResult._id.toString(),
  //     last_test_id: queryResult.last_test_id.toString()
  //   }
  //   console.log(result)
  //   return result
  // } catch (err) {
  //   console.log('Error caught in dbController.getAllRoutes: ', err)
  // }

  getRoute: async (route) => {
    // This function expects to receive a route / fetch resource. E.g.: "/api/user/" as a string
    try {
      // If an actual path was provided as string, search the route detail
      if (route.includes('/')) {
        return await models.Route.find({ detail: route })
      } else {
        // otherwise assume a route _id was passed
        return await models.Route.find({ _id: route })
      }
    } catch (err) {
      console.log('Error caught in dbController.getRoute: ', err)
    }
  },

  getTest: async (test) => {
    try {
      return await models.Route.find({ _id: test })
    } catch (err) {
      console.log('Error caught in dbController.getTest: ', err)
    }
  }
}

module.exports = dbController
