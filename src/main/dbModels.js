const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb+srv://justinwmarchant:l9HPcrjosl0h4tFr@middle-aware-cluster.8frnuhl.mongodb.net/Middle-Aware?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true
  // sets the name of the DB that our collections are part of
  // dbName: 'middle-aware'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err))

const Schema = mongoose.Schema

const routeSchema = new Schema({
  detail: { type: String, required: true },
  input: String,
  middleware: [{
    detail: String,
    input: String
  }],
  last_test_id: {
    // type of ObjectId makes this behave like a foreign key referencing the 'Tests' collection
    type: Schema.Types.ObjectId,
    ref: 'Test'
  }

})
// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example above, the model Tank is for the tanks collection in the database.
// https://mongoosejs.com/docs/models.html
const Route = mongoose.model('Route', routeSchema)

const testSchema = new Schema({
  route_id: {
    // type of ObjectId makes this behave like a foreign key referencing the 'species' collection
    type: Schema.Types.ObjectId,
    ref: 'Route'
  },
  created_at: Number,
  request: {
    method: String,
    endpoint: String
  },
  response: {
    status_code: Number,
    message: String,
    payload: String
  },
  error: String,
  rtt: Number
})

const Test = mongoose.model('Test', testSchema)

module.exports = {
  Route,
  Test
}
