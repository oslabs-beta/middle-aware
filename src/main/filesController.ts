const fs = require('fs')
const path = require('path')

// Traverse directory structure and return an array of file paths for all files
// Optionally, may provide an array of extensions to match. Only files with extensions matching those provided will be placed on the output array.
//   e.g. ['.js', '.jsx', '.ts', '.tsx']
// Returns an array of full path referenced files inside the directory

const filesController = {
  dirRecursiveContents: (dirToParse: string, outArray: string[] = [], extFilter?: string[]):string[] => {
    let allowedExtensions: {[index:string]: boolean} | null = null

    fs.readdirSync(path.resolve(__dirname, dirToParse)).forEach(
    // For each file in the directory, generate an AST
      (file: string) => {
        const pathAndFile = path.resolve(__dirname, dirToParse, file)

        // Create allowed extensions to prevent pushing non javascript files.
        if (extFilter) {
          allowedExtensions = extFilter.reduce((acc, ext) => {
            return {
              ...acc,
              [ext]: true
            }
          }, {})
        }

        // If the subject file is actually a directory, then call this function recursively
        if (fs.lstatSync(pathAndFile).isDirectory()) {
          outArray.concat(filesController.dirRecursiveContents(pathAndFile, outArray))

        // Prevent pushing files not in allowedExtensions
        } else if (!allowedExtensions || path.extname(pathAndFile) in allowedExtensions) {
          outArray.push(pathAndFile) // Push full path to output array
        }
      }
    )
    return outArray
  },

  cloneRecursive: (dirToClone: string, targetDir: string) => {
    const filesArray = filesController.dirRecursiveContents(dirToClone)

    // Helper function to recursively create parent directories if they don't exist
    function checkParentDirs (dir:string) {
      if (!fs.existsSync(path.dirname(dir))) checkParentDirs(path.dirname(dir))
    }

    console.log('fs.existsSync(targetDir) ', fs.existsSync(targetDir))
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir) // Create targetDir if needed

    // Build out directory structure before copying files to improve efficiency
    // Get a list of unique directory names
    const dirs = filesArray.reduce((acc, curr) => {
      const relFilePath = path.relative(dirToClone, curr) // ./frontend/myFile.js
      const targetFilePath = path.resolve(targetDir, relFilePath) // /home/nancy/cloned-project/frontend/myFile.js
      // Logic to add parent directories here?
      // path.sep -> will return either / or \ depending on system
      // checking dir:  /Users/jason/Projects/Codesmith/test
      // checking dir:  /Users/jason/Projects/Codesmith/test/.git
      // checking dir:  /Users/jason/Projects/Codesmith/test/.git/hooks
      // checking dir:  /Users/jason/Projects/Codesmith/test/.git/info
      // checking dir:  /Users/jason/Projects/Codesmith/test/.git/logs
      // missing dir:  /Users/jason/Projects/Codesmith/test/.git/logs/refs
      // checking dir:  /Users/jason/Projects/Codesmith/test/.git/logs/refs/heads
      // create dir:  /Users/jason/Projects/Codesmith/test/.git/logs/refs/heads
      acc.next = path.dirname(targetFilePath)
      if (acc.prev !== '') {
        let prevCount = 0
        let nextCount = 0
        for (let i = 0; i < acc.prev.length; i++) {
          if (acc.prev.charAt(i) === path.sep) prevCount++
        }
        for (let i = 0; i < acc.next.length; i++) {
          if (acc.next.charAt(i) === path.sep) nextCount++
        }
        if (nextCount > prevCount + 1) {
          // const lastSlash = acc.next.lastIndexOf(path.sep)
          // const newPath = acc.next.slice(0, lastSlash)
          acc[path.dirname(acc.next)] = true
        }
      }
      acc.prev = acc.next
      return {
        ...acc,
        [path.dirname(targetFilePath)]: true
      }
    }, { prev: '', next: '' })

    // This approach will ensure that keys are arranged alphabetically and therefore we will be creating parent directories first as-needed
    Object.keys(dirs).forEach((dir) => {
      console.log('checking dir: ', dir)
      if (!fs.existsSync(dir)) {
        console.log('create dir: ', dir)
        // fs.mkdirSync(dir)
      }
    })

    filesArray.forEach((filePath) => {
      // The following example is used to illustrate how this function works
      // e.g. if dirToClone is /home/user/project
      //   and targetDir /home/nancy/cloned-project
      //   and filePath is /home/user/project/frontend/myFile.js
      const relFilePath = path.relative(dirToClone, filePath) // ./frontend/myFile.js
      const targetFilePath = path.resolve(targetDir, relFilePath) // /home/nancy/cloned-project/frontend/myFile.js

      // Check if target directory exists, if not, create it
      // if (!fs.existsSync(path.dirname(targetFilePath))) fs.mkdirSync(path.dirname(targetFilePath))

      // Copy file to new directory
      fs.copyFile(filePath, targetFilePath, (err:string) => {
        // console.log('copied to: ', targetFilePath)
        if (err) { console.log('source was not copied to destination: ', err) }
      })
    })
  }
}

filesController.cloneRecursive('/Users/jason/Projects/Codesmith/precourse-assessment', '/Users/jason/Projects/Codesmith/test')

export default filesController
