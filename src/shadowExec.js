const { exec, execSync } = require('node:child_process')
// const { cloneRecursive } = require('./filesController');
// const { cloneRecursive } = require('./filesController')
const { readConfig } = require('./configManager')

// For testing, we will create a dummy 'config' here, either scan user's root folder for config file or create a window from menu to enter info:
// const config = {
//   rootDir: '/Users/felixljr/Desktop/cards-r-us-main',
//   backEnd: '',
//   startScript: 'npm run start:dev',
//   targetDir: '/Users/felixljr/Desktop/shadow2'
// }

//
// cloneRecursive(config.rootDir, config.targetDir)
// NOTE: Need to refactor as this will only work on Unix-based systems
const shadowExec = {
  makeShadow: function (rootDir, targetDir) {
    const copyProcess = execSync('cp -R ' + rootDir + '/* ' + targetDir)

    console.log('stdout: ' + copyProcess.toString())
    // copyProcess.stdout.on('data', function (data) {
    //   console.log('stdout: ' + data.toString())
    // })

    // copyProcess.stderr.on('data', function (data) {
    //   console.log('stderr: ' + data.toString())
    // })

    // copyProcess.on('exit', function (code) {
    //   console.log('child process exited with code ' + code.toString())
    // })
  },
  // shadowProcess = exec('cd ' + config.targetDir + '; ' + config.startScript)

  startShadow: function (targetDir, startScript) {
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

module.exports = shadowExec
