import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import generate from '@babel/generator'
import path from 'path'

interface fetchCall {
  node: string,
  arguments: string[]
}

function processLineByLine (dirToParse) {
  // This function returns a promise that resolves to an array of all the resources and options for fetch operations in a given front end.

  let promiseResolve, promiseReject

  const promise = new Promise(function (resolve, reject) {
    promiseResolve = resolve
    promiseReject = reject
  })

  const outArray: fetchCall[] = []
  fs.readdirSync(path.resolve(__dirname, dirToParse)).forEach(
    // For each file in the directory, we are going to call this anonymous arrow function to open a file stream and parse the file line by line.
    async (file, i, arr) => {
      const source = fs.readFileSync(file, 'utf-8') // Convert the file to a string
      const ast = parser.parse(source, { tokens: true }) // Convert the string to AST, add tokens array to file node

      // Alternative to traversal, simply loop the tokens and look for fetch function calls.
      // ast.tokens.forEach((token) => {
      //   if (token.identified === 'fetch') { outArray.push('found one') }
      // })

      // Traverse the AST and extract the endpoint and options for the fetch request
      // Note: Identifier fetch, get function arguments 1 and 2.
      traverse(ast, {
        // Consider a bare fetch request and assign the GET method
        // CallExpression.callee: Identifier.name = "fetch"
        // CallExpression.arguments = []
        //  Do we want to run this node through the generator to get the thing to push?
        //  AST can determine if the first argument contains a variable. We can utilize this in our code to associate what is captured in the file parse to the things that are captured by the proxy.

        // Look for type is CallExpression
        CallExpression: function (path) {
          // t.isCallExpression will return true if all the options are also true?
          if (t.isCallExpression(path.node, {
            callee: (calleePath) => {
              const callee = calleePath.node
              return callee.type === 'Identifier' && callee.name === 'fetch'
            },
            arguments: () => true // return true function call contains arguments?
          })) {
            outArray.push({
              node: generate(path.node).code,
              arguments: path.node.arguemnts.map((argPath) => generate(argPath.node).code)
            })
          }
        }

      })

      // TO DO: Need to place this in the correct spot in the code
      promiseResolve(outArray)
    }
  )
  return promise
}

export default processLineByLine
