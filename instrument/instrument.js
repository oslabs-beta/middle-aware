// using babel/core to parse, traverse, transform, and generate javascript code
const babel = require('@babel/core')
// filesystem is being used to ingest a single file
const fs = require('fs')
// provide path to cardsController.js in  your local dev
const code = fs.readFileSync('/Users/timchang/Documents/Codesmith/OSP/Cards-R-Us-2/backend/controllers/cardsController.js', 'utf8')
// const code = fs.readFileSync('/Users/timchang/Documents/Codesmith/Projects/Subslify/server/src/controllers/authController.js', 'utf8')
// used to track if module type of the relevant js file is ESM or CJS
const isESM = false
// send the function name to the proxy server

// helper function to inject code
const transform = (content) => {
  return babel.transformSync(content, { ast: true }).ast.program.body
}

// Optimizaiton Opportunity - Is there a way where we don't have to traverse the AST twice? Maybe force subject code to be interpreted as ESM by enabling module type in nearest package.json. Could potentially force the visitor to run some logic at program before inserting import or require statement.
// https://stackoverflow.com/questions/58384179/syntaxerror-cannot-use-import-statement-outside-a-module
// It appears that AST traversal and use of plugins is done in parallel to save processing time
// Therefore, we have two transforms happening
// https://jamie.build/babel-plugin-ordering.html
const output = babel.transformSync(code, {
  plugins: [
    {
      visitor: {
        // visiting every type of function node
        Function (path) {
          let functionName = ''
          if (path.node.key) {
            // get function name
            functionName = path.node.key.name
          }
          // get all the parameters in the function we are visiting
          const params = new Set()
          for (const param of path.node.params) {
            params.add(param.name)
          }
          // this is how we can distinguish between regluar functions and middleware functions
          if (params.has('req') || params.has('res') || params.has('next')) {
            // add the injected logic to the top of each middleware function implemented in this pattern
            const bodyPath = path.get('body')
            bodyPath.unshiftContainer('body', transform(`  const collectMAData = async (testId, functionName) => {
              const test = await fetch('http://127.0.0.1:9001/middleAwareAgent', {
                method:'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({testId, functionName})
              });
            }
            collectMAData(req.headers['middle-aware-test-id'].toString(), '${functionName}')`))
          }
        }
      }
    }
  ]
})
fs.writeFileSync('/Users/timchang/Documents/Codesmith/OSP/Cards-R-Us-2/backend/controllers/cardsController.js', output.code)
console.log(output.code)
