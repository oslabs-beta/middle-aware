import fs from 'fs'

const configManager = {
  copyConfig: (filePath) => {
    // OpenFileDialog? <= This is handled by the electron FE
    fs.copyFileSync(filePath, configManager.determineDir() + 'config.json')
  },

  determineDir: () => {
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
  },

  readConfig: () => {
    // let config = {}

    // fs.readFile(fileDir + 'config.json', { encoding: 'utf8' }, (err, data) => {
    //   if (err) throw err
    //   config = JSON.parse(data)
    // })

    return JSON.parse(fs.readFileSync(configManager.determineDir() + 'config.json', { encoding: 'utf8' }))
  }

}

export default configManager
