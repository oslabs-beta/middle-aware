const { exec } = require('node:child_process')
// const { cloneRecursive } = require('./filesController');
const { cloneRecursive } = require('./filesController')

// For testing, we will create a dummy 'config' here, either scan user's root folder for config file or create a window from menu to enter info:
const config = {
  rootDir: '/Users/felixljr/Desktop/cards-r-us-main',
  backEnd: '',
  startScript: 'npm run start:dev',
  targetDir: '/Users/felixljr/Desktop/shadow2'
}

//
// cloneRecursive(config.rootDir, config.targetDir)
// NOTE: Need to refactor as this will only work on Unix-based systems

const copyProcess = exec('cp -R ' + config.rootDir + '/* ' + config.targetDir)

copyProcess.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString())
})

copyProcess.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString())
})

copyProcess.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString())
  startShadow()
})

// shadowProcess = exec('cd ' + config.targetDir + '; ' + config.startScript)

function startShadow () {
  const shadowProcess = exec('cd ' + config.targetDir + '; ' + config.startScript)
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
