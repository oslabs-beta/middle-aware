import mongoose, { Schema, model, connect, Types, ConnectOptions, ObjectId } from 'mongoose'

const MONGODB_URI = 'mongodb+srv://justinwmarchant:l9HPcrjosl0h4tFr@middle-aware-cluster.8frnuhl.mongodb.net/Middle-Aware?retryWrites=true&w=majority'

// create extended ConnectOptions interface by adding two new property
interface MongoConnectOps extends ConnectOptions {
  useNewUrlParser?: boolean
  useUnifiedTopology?: boolean
}

const connectionOptions: MongoConnectOps = {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true
  // sets the name of the DB that our collections are part of
  // dbName: 'middle-aware'
}

mongoose.connect(MONGODB_URI, connectionOptions)
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err))

// const Schema = mongoose.Schema

interface RouteSchemaType {
  detail: string
  input?: string
  middleware: object[]
  last_test_id: {
    type: ObjectId
    ref: string
  }
}

interface TestSchemaType {
  created_at: number
  request?: {
    method?: string
    endpoint?: string
  }
  response?: {
    status_code?: number
    message?: string
    payload?: string
  }
  error?: string
  rtt?: string
  route_id: {
    type: ObjectId
    ref: string
  }
}

const RouteSchema: Schema<RouteSchemaType> = new Schema({
  detail: { type: String, required: true }, // path
  input: String, // if any params, in the body of request
  middleware: [{
    detail: String,
    input: String
  }], // store middleware chain.
  last_test_id: {
    // type of ObjectId makes this behave like a foreign key referencing the 'Tests' collection
    type: Schema.Types.ObjectId,
    ref: 'Test'
  }

})

const TestSchema: Schema<TestSchemaType> = new Schema({
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
  rtt: String
})

// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example above, the model Tank is for the tanks collection in the database.
// https://mongoosejs.com/docs/models.html
const Route = model('Route', RouteSchema)
const Test = model('Test', TestSchema)

export default {
  Route,
  Test
}
