import fs from 'fs'
import path from 'path'

// Traverse directory structure and return an array of file paths for all files
// Optionally, may provide an array of extensions to match. Only files with extensions matching those provided will be placed on the output array.
//   e.g. ['.js', '.jsx', '.ts', '.tsx']
// Returns an array of full path referenced files inside the directory

const filesController = {
  dirRecursiveContents: (dirToParse: string, outArray: string[] = [], extFilter?: string[]):string[] => {
    let allowedExtensions: {[index:string]: boolean} | null = null

    fs.readdirSync(path.resolve(__dirname, dirToParse)).forEach(
    // For each file in the directory, generate an AST
      (file) => {
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
          outArray.concat(parseAPIRequests(pathAndFile, outArray))

        // Prevent pushing files not in allowedExtensions
        } else if (!allowedExtensions || path.extname(pathAndFile) in allowedExtensions) {
          outArray.push(pathAndFile) // Push full path to output array
        }
      }
    )
    return outArray
  },

  cloneRecursive: (dirToClone: string, targetDir: string) => {
    fs.readdirSync(path.resolve(__dirname, dirToClone)).forEach((file) => {
      const pathAndFile = path.resolve(__dirname, dirToClone, file)

      // path.extname(path)
      // path.dirname(path)
      // path.relative(from, to)

      // If the subject file is actually a directory, then create this directory in the new folder
      //  Then call this method on the directory
      if (fs.lstatSync(pathAndFile).isDirectory()) {
        const recursiveTarget = path.relative(targetDir)
        fs.mkdirSync(path.resolve(targetDir, pathAndFile))

      fs.copyFile('source.txt', 'destination.txt', (err) => {
        if (err) throw err
        console.log('source.txt was copied to destination.txt')
      })
    })
  }

}

export default filesController
