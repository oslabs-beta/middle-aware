import * as fs from 'fs'

interface middleAwareConfig{
    backend?: string,
    proxyPort?: number,
    backEndPort?: number,
    frontEndPort?: number
}
interface configManager{
    copyConfig: (filePath: string) => void,
    determineDir: ()=> void,
    readConfig: () => middleAwareConfig
}

export const copyConfig = (filePath) => {
  // OpenFileDialog? <= This is handled by the electron FE
  fs.copyFileSync(filePath, determineDir() + 'config.json')
}

export const determineDir = () => {
  // Determine users OS to get the correct path for config file
  // https://cameronnokes.com/blog/how-to-store-user-data-in-electron/
  let fileDir: string

  // Mac OS: ~/Library/Application Support/<Your App Name (taken from the name property in package.json)>
  // Windows: C:\Users\<you>\AppData\Local\<Your App Name>
  // Linux: ~/.config/<Your App Name>

  if (process.platform === 'win32') {
    fileDir = process.env.APPDATA + '\\Local\\middle-aware\\'
  } else if (process.platform === 'darwin') {
    fileDir = process.env.HOME + '/Library/Application Support/middle-aware/'
  } else { // assume linux
    fileDir = process.env.HOME + '.config/middle-aware/'
  }

  return fileDir
}

export const readConfig = () => {
  const configurations = {}
  const properties = ['rootDir', 'backEnd', 'startScript', 'targetDir', 'MONGODB_URI', 'proxyPort', 'backEndPort', 'frontEndPort']
  if (fs.existsSync(determineDir() + 'config.json')) {
    const file = JSON.parse(fs.readFileSync(determineDir() + 'config.json', { encoding: 'utf8' }))
  } else { // Return default configuration if the config.json does not exist
    return {
      rootDir: '',
      backEnd: '',
      startScript: 'npm run start',
      targetDir: determineDir() + '/shadowDir',
      MONGODB_URI: '',
      proxyPort: 9003,
      backEndPort: 3000,
      frontEndPort: 8080
    }
  }
}

export default { copyConfig, determineDir, readConfig }
