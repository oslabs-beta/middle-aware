import fs from 'fs'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import generate from '@babel/generator'
import path from 'path'
import filesController from './filesController'
interface fetchCall {
  method: string,
  route: string,
  options: object
}

// This is a stand-in for the path in a babel AST visitor framework
interface Path {
  parent: t.Node,
  node: t.CallExpression
}

// Traverse directory structure and generate ASTs, return ASTs in an array for further processing

function parseAPIRequests (dirToParse: string, outArray: fetchCall[] = []) {
  filesController.dirRecursiveContents(path.resolve(__dirname, dirToParse), [], ['.js', '.jsx', '.ts', '.tsx']).forEach(
    // For each file in the directory, generate an AST
    (pathAndFile, i, arr) => {
      const source = fs.readFileSync(pathAndFile, 'utf-8') // Convert the file to a string
      // To DO - infer plugins based on file extensions
      const ast = parse(source, { errorRecovery: true, plugins: ['jsx', 'typescript'] }) // Convert the string to AST

      traverse(ast, {
        // Consider a bare fetch request and assign the GET method
        // CallExpression.callee: Identifier.name = "fetch"
        // CallExpression.arguments = []

        // Look for node type 'CallExpression'
        CallExpression: function (path: any) {
          // May need a helper function for this when the options consists of nested objects

          function buildNestedObj (inputObjExp: any, outObj: {[index: string]: unknown} = {}): object {
            // This function will take in an AST ObjectExpression and return a javascript object of that expression
            return inputObjExp.properties.reduce((result, property) => {
              const key = property.key.name || property.key.value
              if (property.value.type === 'ObjectExpression') {
                result[key] = buildNestedObj(property.value)
              } else if (property.value.type === 'StringLiteral') {
                result[key] = property.value.value
                // Otherwise, process this as a string
              } else { // if (property.value.type === 'CallExpression' || property.value.type === 'TemplateLiteral') {
                // const tempFunc = new Function(`return ${generate(property.value, opt).code}`)
                result[key] = source.slice(property.value.start, property.value.end)
              }
              return result
            }, outObj)
          }

          if (path.node.callee.name === 'fetch' && path.node.arguments) {
            const funcCall = path.node
            let options

            // (funcCall.arguments[1] ? JSON.parse(JSON.stringify(generate(funcCall.arguments[1], { jsonCompatibleStrings: true }).code)) : false) // Assign arguments

            // Option: Convert the options back to an object literal:
            if (funcCall.arguments[1]) {
              options = buildNestedObj(funcCall.arguments[1])
            // options = funcCall.arguments[1].properties.reduce((result, property) => {
            //   result[property.key.name] = property.value.value
            //   return result
            // }, {})
            }

            outArray.push({
              method: (options?.method ? options.method : 'GET'),
              route: funcCall.arguments[0].value ?? source.slice(funcCall.arguments[0].start + 1, funcCall.arguments[0].end - 1),
              options: (options || null)
            })
          }
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