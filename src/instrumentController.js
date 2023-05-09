import fkill from 'fkill'
import fixPath from 'fix-path'
const { exec, execSync } = require('node:child_process')
const babel = require('@babel/core')
const fs = require('fs')
const instrumentController = {
  killPorts: async (ports) => {
    // kill ports
    await fkill(ports, { silent: true })
  },
  transformFile: (path, proxyPort) => {
    // read the contents of the js file provided in this path
    const code = fs.readFileSync(path, 'utf8')
    // helper function to inject code
    const transform = (content) => {
      return babel.transformSync(content, { ast: true }).ast.program.body
    }

    // https://stackoverflow.com/questions/58384179/syntaxerror-cannot-use-import-statement-outside-a-module
    // https://jamie.build/babel-plugin-ordering.html
    const output = babel.transformSync(code, {
      plugins: [
        {
          visitor: {
            Program (path) {
              const importStatement = path.node.body.find(node => node.type === 'ImportDeclaration' && node.source.value === 'axios')
              if (!importStatement) {
                const importNode = transform('import axios from \'axios\'')[0]
                // t.importDeclaration(
                //   [t.importDefaultSpecifier(t.identifier('axios'))],
                //   t.stringLiteral('axios')
                // )
                path.node.body.unshift(importNode)
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
                bodyPath.unshiftContainer('body', transform(`const collectMAData = async (testId, functionName) => {
              const test = await axios.put('http://127.0.0.1:${proxyPort}/middleAwareAgent', {testId, functionName});
            }
            collectMAData(req.headers['middle-aware-test-id'].toString(), '${functionName}')`))
              }
            }
          }
        }
      ]
    })
    return output.code
  },

  modifyShadowFile: (path, code) => {
    // write to the existing shadow file in this path the new trasnformed code
    fs.writeFileSync(path, code)
  },

  makeShadow: function (rootDir, targetDir) {
    const copyProcess = execSync(`rsync -a --exclude .git ${rootDir}/ ${targetDir}`)
    console.log('stdout: ' + copyProcess.toString())
  },

  startShadow: function (targetDir, startScript) {
    fixPath()
    const shadowProcess = exec('cd ' + targetDir + '; ' + startScript)
    shadowProcess.stdout.on('data', function (data) {
      console.log('stdout: ' + data.toString())
    })

    shadowProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString())
    })

    shadowProcess.on('exit', function (code) {
      console.log('child process exited with code ' + code.toString())
    })
  }
}

export default instrumentController
