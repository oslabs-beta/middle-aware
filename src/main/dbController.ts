const models = require('./models');

interface dbController {
  getAllRoutes: Function;
  getRoute: Function;
  getTest: Function;
}

interface Test {
  route: string;
  created_at?: string;
  request?: string;
  response?: string;
  error?: string;
  payload?: string;
}

interface Route {
  detail: string;
  input: string;
  middleware?: string;
  last_test: Test;
}

const dbController: dbController = {
  getAllRoutes: async () => {
    try {
      // https://mongoosejs.com/docs/api.html#model_Model-find
      return await models.Route.find({});
    } catch (err) {
      console.log('Error caught in dbController.getAllRoutes: ', err);
    }
  },

  getRoute: async (route) => {
    // This function expects to receive a route / fetch resource. E.g.: "/api/user/" as a string
    try {
      // If an actual path was provided as string, search the route detail
      if (route.includes('/')) {
        return await models.Species.find({ detail: route });
      } else {
        // otherwise assume a route _id was passed
        return await models.Species.find({ _id: route });
      }
    } catch (err) {
      console.log('Error caught in dbController.getRoute: ', err);
    }
  },

  getTest: async (test) => {
    try {
      return await models.Species.find({ _id: test });
    } catch (err) {
      console.log('Error caught in dbController.getTest: ', err);
    }
  },
};

module.exports = dbController;
