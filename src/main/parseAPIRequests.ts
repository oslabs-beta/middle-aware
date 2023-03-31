import fs from 'fs'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import generate from '@babel/generator'
import path from 'path'
interface fetchCall {
  method: string,
  route: string,
  options: object
}

function parseAPIRequests (dirToParse: string) {
  // This function returns a promise that resolves to an array of all the resources and options for fetch operations in a given front end.

  // let promiseResolve, promiseReject

  // const promise = new Promise(function (resolve, reject) {
  //   promiseResolve = resolve
  //   promiseReject = reject
  //   setTimeout(() => {
  //     reject(new Error('There was an issue with the file parse promise'))
  //   }, 100)
  // })

  const outArray: fetchCall[] = []
  fs.readdirSync(path.resolve(__dirname, dirToParse)).forEach(
    // For each file in the directory, we are going to call this anonymous arrow function to open a file stream and parse the file line by line.
    (file, i, arr) => {
      const source = fs.readFileSync(path.resolve(__dirname, dirToParse, file), 'utf-8') // Convert the file to a string
      const ast = parse(source, { errorRecovery: true, plugins: ['jsx', 'typescript'] }) // Convert the string to AST

      // Alternative to traversal, simply loop the tokens and look for fetch function calls.
      // ast.tokens.forEach((token) => {
      //   if (token.identified === 'fetch') { outArray.push('found one') }
      // })

      // console.log(`File: ${file}, \n AST: ${JSON.stringify(ast)}`)

      // Traverse the AST and extract the endpoint and options for the fetch request
      // Note: Identifier fetch, get function arguments 1 and 2.
      traverse(ast, {
        // Consider a bare fetch request and assign the GET method
        // CallExpression.callee: Identifier.name = "fetch"
        // CallExpression.arguments = []
        //  Do we want to run this node through the generator to get the thing to push?
        //  AST can determine if the first argument contains a variable. We can utilize this in our code to associate what is captured in the file parse to the things that are captured by the proxy.

        // Look for node type 'CallExpression'
        CallExpression: function (path: any) {
          // t.isCallExpression will return true if all the options are also true?

          // Path is going to be the parent and the node associated with a call expression (e.g.??)
          // Path.node is going to be the actual node in the AST which contains the call expression
          // Node {
          //     type: 'CallExpression',
          //     start: 511,
          //     end: 666,
          //     loc: SourceLocation {
          //       start: Position { line: 20, column: 4, index: 511 },
          //       end: Position { line: 26, column: 6, index: 666 },
          //       filename: undefined,
          //       identifierName: undefined
          //     },
          //     callee: Node {
          //       type: 'Identifier',
          //       start: 511,
          //       end: 516,
          //       loc: SourceLocation {
          //         start: [Position],
          //         end: [Position],
          //         filename: undefined,
          //         identifierName: 'fetch'
          //       },
          //       name: 'fetch'
          //     },
          //     arguments: [
          //       Node {
          //         type: 'StringLiteral',
          //         start: 517,
          //         end: 530,
          //         loc: [SourceLocation],
          //         extra: [Object],
          //         value: '/api/signup'
          //       },
          //       Node {
          //         type: 'ObjectExpression',
          //         start: 532,
          //         end: 665,
          //         loc: [SourceLocation],
          //         properties: [Array],
          //         extra: [Object]
          //       }
          //     ]
          //   }

          // method: undefined,
          // route: '/api/signup',
          // options: '{\n' +
          //   "  method: 'POST',\n" +
          //   '  headers: {\n' +
          //   "    'Content-Type': 'application/json'\n" +
          //   '  },\n' +
          //   '  body: JSON.stringify(info)\n' +
          //   '}'

          // console.log(path.node)
          if (path.node.callee.name === 'fetch' && path.node.arguments) {
            const funcCall = path.node
            const options = {}
            // (funcCall.arguments[1] ? JSON.parse(JSON.stringify(generate(funcCall.arguments[1], { jsonCompatibleStrings: true }).code)) : false) // Assign arguments
            // conver the options back to an object literal:
            if (funcCall.arguments[1]) {
              funcCall.arguments[1].properties.forEach((prop) => {
                options[prop.key.name || prop.key.value] = generate(prop.value, {}, '').code
              })
            }

            outArray.push({
              method: (options.method ? options.method : 'GET'),
              route: funcCall.arguments[0].value,
              options
            })
          }

          // TO DO: Determine how to use this syntax for future use
          // if (t.isCallExpression(path.node, {
          //   callee: (calleePath) => {
          //     console.log(path.node)
          //     console.log(calleePath)
          //     const callee = calleePath.node
          //     return callee.type === 'Identifier' && callee.name === 'fetch'
          //   },
          //   arguments: () => true // return true function call contains arguments?
          // })) {
          //   outArray.push({
          //     node: generate(path.node).code,
          //     arguments: path.node.arguments.map((argPath) => generate(argPath.node).code)
          //   })
        }
      })
    })

  console.log('outArray: ', outArray)
  // if (i === arr.length - 1) {
  //   promiseResolve(outArray)
  // }
  // TO DO: Need to place this in the correct spot in the code
  return outArray
}

module.exports = parseAPIRequests
