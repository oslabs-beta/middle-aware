const express = require('express')
const dbController = require('../src/main/dbController')

const app = express()

app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// Middle-Aware Agent Route to store call stack tracing details
// this may need to be separated from the proxy server
app.put('/middleAwareAgent', async (req, res, next) => {
  // middleAwareTestID
  const { testId, functionName } = req.body
  await dbController.default.addFuncNameToTest(testId, functionName)
})

app.listen(9001, () => {
  console.log('Agent is listening on port 9001')
})
