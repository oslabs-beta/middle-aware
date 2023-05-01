const express = require('express')
const dbController = require('./dbController')

//appAgent use because of TS error of using same variable
const appAgent = express()

appAgent.use(express.json())
// appAgent.use(express.urlencoded({ extended: false }))
// Middle-Aware Agent Route to store call stack tracing details
// this may need to be separated from the proxy server
appAgent.put('/middleAwareAgent', async (req, res, next) => {
  // middleAwareTestID
  const { testId, functionName } = req.body
  // do I have to use default here? why am I required here but not elsewhere?
  await dbController.default.addFuncNameToTest(testId, functionName)
})
appAgent.listen(9001, () => {
  console.log('Agent is listening on port 9001')
})