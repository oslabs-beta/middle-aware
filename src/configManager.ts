import * as fs from 'fs'
import { MAConfig } from './Types'

export const copyConfig = (filePath: string): void => {
  // OpenFileDialog? <= This is handled by the electron FE
  fs.copyFileSync(filePath, determineDir() + 'config.json')
}

export const determineDir = ():string => {
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

export const readConfig = (): MAConfig => {
  if (fs.existsSync(determineDir() + 'config.json')) {
    return JSON.parse(fs.readFileSync(determineDir() + 'config.json', { encoding: 'utf8' }))
  } else { // Return default configuration if the config.json does not exist
    return {
      MONGODB_URI: '',
      proxyPort: 9003,
      backEndPort: 3000,
      frontEndPort: 8080,
      targetDir: '',
      rootDir: '',
      backEnd: '',
      frontEnd: '',
      startScript: '',
      projectName: 'ENTER CONFIG'
    }
  }
}

export default { copyConfig, determineDir, readConfig }
