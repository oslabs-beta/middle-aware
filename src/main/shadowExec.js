const { exec } = require('node:child_process');
// const { cloneRecursive } = require('./filesController');
const {cloneRecursive} = require('./filesController');

// For testing, we will create a dummy 'config' here, either scan user's root folder for config file or create a window from menu to enter info:
const config = {
    rootDir: '/Users/felixljr/Desktop/cards-r-us-main',
    backEnd: '',
    startScript: 'npm run start:dev',
    targetDir: '/Users/felixljr/Desktop/shadow'
}

// 
cloneRecursive(config.rootDir, config.targetDir)

// Is this going to work? 
// we can't just execute npm start this way (need to be in the correct dir for that)

exec('cd ' + config.targetDir + '; ' + config.startScript, (error, stdout, stder) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});