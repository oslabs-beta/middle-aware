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

// Traverse directory structure and generate ASTs, return ASTs in an array for further processing

export function parseAPIRequests (dirToParse: string, outArray: fetchCall[] = []) {
  fs.readdirSync(path.resolve(__dirname, dirToParse)).forEach(
    // For each file in the directory, generate an AST
    (file, i, arr) => {
      const pathAndFile = path.resolve(__dirname, dirToParse, file)
      // Create allowed extensions to prevent the parser from parsing non javascript files.
      const allowedExtensions = { '.js': true, '.jsx': true, '.ts': true, '.tsx': true }

      // If the subject file is actually a directory, then call this function recursively
      if (fs.lstatSync(pathAndFile).isDirectory()) {
        outArray.concat(parseAPIRequests(pathAndFile, outArray))
        // prevent reading non-js files
      } else if (path.extname(pathAndFile) in allowedExtensions) {
        console.log('About to parse: ', pathAndFile)
        const source = fs.readFileSync(pathAndFile, 'utf-8') // Convert the file to a string
        // To DO - infer plugins based on file extensions
        const ast = parse(source, { errorRecovery: true, plugins: ['jsx', 'typescript'] }) // Convert the string to AST
      }
    }
  )
}