const express = require('express')
const dbController = require('./dbController')

const app = express()

app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// Middle-Aware Agent Route to store call stack tracing details
// this may need to be separated from the proxy server
app.put('/middleAwareAgent', async (req, res, next) => {
  // middleAwareTestID
  const { testId, functionName } = req.body
  // do I have to use default here? why am I required here but not elsewhere?
  await dbController.default.addFuncNameToTest(testId, functionName)
})

app.listen(9001, () => {
  console.log('Agent is listening on port 9001')
})
