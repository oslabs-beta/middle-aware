// using babel/core to parse, traverse, transform, and generate javascript code
const babel = require('@babel/core')
// filesystem is being used to ingest a single file
const fs = require('fs')
// provide path to cardsController.js in  your local dev
const code = fs.readFileSync('/Users/timchang/Documents/Codesmith/OSP/Cards-R-Us-2/backend/controllers/cardsController.js', 'utf8')
// const code = fs.readFileSync('/Users/timchang/Documents/Codesmith/Projects/Subslify/server/src/controllers/authController.js', 'utf8')
let isESM = false
// send the function name to the proxy server

// helper function to inject code
const transform = (content) => {
  return babel.transformSync(content, { ast: true }).ast.program.body
}
// Optimization Opportunity - if we need to run transform twice, this transform should not generate code to reduce processing
const confirmModuleType = babel.transformSync(code, {
  // create custom function leveraging visitor pattern
  plugins: [
    {
      // should probably break this out into another file and import it here
      visitor: {
        // ESM uses import statements to import modules
        // Import declaration is the node type for import statements
        ImportDeclaration (path) {
          isESM = true
        },
        // CJS uses the require function to import modules
        // Since it is a function and it is being called it is a CallExpression node type
        CallExpression (path) {
          if (path.get('callee').isIdentifier({ name: 'require' })) {
            isESM = false
          }
        },
        // ESM uses export def
        ExportNamedDeclaration (path) {
          isESM = true
        },
        ExportDefaultDeclaration (path) {
          isESM = true
        },
        ExportAllDeclaration (path) {
          isESM = true
        },
        ExpressionStatement (path) {
          const expression = path.node.expression
          if (
            expression.type === 'AssignmentExpression' &&
            expression.left.type === 'MemberExpression' &&
            expression.left.object.name === 'module' &&
            expression.left.property.name === 'exports'
          ) {
            isESM = false
          }
        }
      }
    }
  ]
})
// Optimizaiton Opportunity - Is there a way where we don't have to traverse the AST twice?
// It appears that since AST traversal is DFS, it will always run from top-top-bottom, no matter how the plugins or visitors are ordered procedurally
// Therefore, we have two transforms happening
const output = babel.transformSync(code, {
  plugins: [
    {
      visitor: {
        Program (path) {
          if (isESM) {
            path.unshiftContainer('body', transform('import axios from \'axios\''))
          } else {
            path.unshiftContainer('body', transform('const axios = require(\'axios\')'))
          }
        },
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
            bodyPath.unshiftContainer('body', transform(`const collectMAData = () => {
                axios.post({
                    method: 'post',
                    url: 'http://localhost:9000/middleAwareAgent',
                    data: {
                        testId: req.headers['middle-aware-test-id'],
                        functionName: '${functionName}'
                    }
                
                })
            }
            collectMAData()`))
          }
        }
      }
    }
  ]
})

console.log(output.code)
