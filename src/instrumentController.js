import fkill from 'fkill'
const { spawn, spawnSync, execSync } = require('node:child_process')
const babel = require('@babel/core')
const fs = require('fs')

const instrumentController = {
  killPorts: async (ports) => {
    // kill ports
    await fkill(ports, { silent: true })
  },
  transformFile: (path) => {
    // read the contents of the js file provided in this path
    const code = fs.readFileSync(path, 'utf8')
    console.log('path', path)
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
    console.log('end')
    return output.code
  },

  modifyShadowFile: (path, code) => {
    // write to the existing shadow file in this path the new trasnformed code
    fs.writeFileSync(path, code)
  },

  makeShadow: function (rootDir, targetDir) {
    const child = spawn('cp -R ' + rootDir + '/* ' + targetDir, { stdio: ['inherit', 'pipe', 'pipe'] })

    child.stdout.on('data', data => {
      console.log(`stdout: ${data}`)
    })

    child.stderr.on('data', data => {
      console.error(`stderr: ${data}`)
    })

    child.on('close', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`)
    })
    //   const copyProcess = execSync('cp -R ' + rootDir + '/* ' + targetDir)

    //   console.log('stdout: ' + copyProcess.toString())
    // },

  // startShadow: function (targetDir, startScript) {
  //   try {
  //     const shadowProcess = execSync('cd ' + targetDir + '; ' + startScript, { stdio: 'inherit' })
  //   } catch (err) {
  //     console.log('err: ' + err)
  //   }
  }
}

export default instrumentController
