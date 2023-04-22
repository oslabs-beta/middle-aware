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
          outArray.concat(filesController.dirRecursiveContents(pathAndFile, outArray, extFilter))

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

    fs.rmSync(targetDir, { force: true, recursive: true })

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir) // Create targetDir if needed

    // Build out directory structure before copying files to improve efficiency
    const accumulator : {[index: string]: string} = { prev: '', next: '' }

    // dirs will be a list of unique directory names
    const dirs = filesArray.reduce((acc, curr) => {
      const relFilePath = path.relative(dirToClone, curr) // ./frontend/myFile.js
      const targetFilePath = path.resolve(targetDir, relFilePath) // /home/nancy/cloned-project/frontend/myFile.js

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
        // If the directory depth of this item is two or more than the last
        if (nextCount > prevCount + 1) {
          // Store parent directory
          let newPath = path.dirname(acc.next)
          const pathsToAdd: string[] = []
          do {
            pathsToAdd.push(newPath)
            newPath = path.dirname(newPath)
          } while (!fs.existsSync(newPath))
          // Push all the additional paths to the object
          for (const pathToAdd of pathsToAdd) { acc[pathToAdd] = 'true' }
        }
      }
      acc.prev = acc.next

      let newPath = path.dirname(acc.next)
      const pathsToAdd: string[] = []
      do {
        pathsToAdd.push(newPath)
        newPath = path.dirname(newPath)
      } while (!fs.existsSync(newPath))
      // Push all the additional paths to the object
      for (const pathToAdd of pathsToAdd) { acc[pathToAdd] = 'true' }

      return {
        ...acc,
        [path.dirname(targetFilePath)]: 'true'
      }
    }, accumulator)

    // This approach will ensure that keys are arranged alphabetically and therefore we will be creating parent directories first as-needed
    Object.keys(dirs).forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
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
        if (err) { console.log('source was not copied to destination: ', err) }
      })
    })
  }
}

// filesController.cloneRecursive('/Users/jason/Projects/Codesmith/precourse-assessment', '/Users/jason/Projects/Codesmith/test')

module.exports = filesController
