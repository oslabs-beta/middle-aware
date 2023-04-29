import mongoose, { Schema, model, Document, connect, Types, ConnectOptions, ObjectId } from 'mongoose'
import * as dotenv from 'dotenv'
import { TestRequest } from './Types'
// process.env.MONGODB_URI as MONGODB_URI

// Load config
dotenv.config({ path: '../.env' })

// const MONGODB_URI: string = process.env.MONGODB_URI!
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

type StringObject = {
    [key: string]: string;
  }
  /*
  type StringObject = {
  [key: string]: string;
}

// Example usage
const myObj: StringObject = {
  prop1: "value1",
  prop2: "value2",
  // You can add any other properties here
};

*/

interface RouteSchemaType extends Document<Types.ObjectId> {
  detail: string // method + path/route (eg. GET /api/login)
  last_test: object
}

const RouteSchema: Schema<RouteSchemaType> = new Schema({
  detail: { type: String, required: true },
  last_test: Schema.Types.Mixed
})

interface TestSchemaType extends Document<Types.ObjectId> {
    // _id: Types.ObjectId
    route?: {
      type: ObjectId
      ref: string
    }
    created_at: number
    request?: TestRequest
  //   {
  //     method?: string
  //     route?: string
  //     params?: string
  //     query?: string
  //     body?: any// json!
  // }
  response?: {
    status_code?: number
    body?: any
  }
  middleware?: string[]
  error?: boolean
  response_time?: string
}
const TestSchema: Schema<TestSchemaType> = new Schema({
  route: {
    // type of ObjectId makes this behave like a foreign key referencing the 'species' collection
    type: Schema.Types.ObjectId,
    ref: 'Route'
  },
  created_at: Number,
  request: {
    method: String,
    route: String,
    params: {
      type: Schema.Types.Mixed,
      default: {}
    },
    query: {
      type: Schema.Types.Mixed,
      default: {}
    },
    body: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  response: {
    status_code: Number,
    body: Schema.Types.Mixed
  },
  middleware: [String],
  error: Boolean, // set to a boolean value
  response_time: String
}, { minimize: false })

// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example above, the model Tank is for the tanks collection in the database.
// https://mongoosejs.com/docs/models.html
const Route = model('Route', RouteSchema)
const Test = model('Test', TestSchema)

export { Route, Test }