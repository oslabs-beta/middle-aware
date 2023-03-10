const fs = require('fs')
const readline = require('readline')
const path = require('path')

function processLineByLine (dirToParse) {
  // This function returns a promise that resolves to an array of all the resources and options for fetch operations in a given front end.

  let promiseResolve, promiseReject

  const promise = new Promise(function (resolve, reject) {
    promiseResolve = resolve
    promiseReject = reject
  })

  const outArray = []
  fs.readdirSync(path.resolve(__dirname, dirToParse)).forEach(
    async (file, i, arr) => {
      const fileStream = fs.createReadStream(
        path.resolve(__dirname, dirToParse, file)
      )

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      })
      // Note: we use the crlfDelay option to recognize all instances of CR LF
      // ('\r\n') in input.txt as a single line break.

      // Likely need to create and return a promise from the function and resolve it here.
      rl.on('close', () => {
        if (i === arr.length - 1) {
          // console.log(outArray);
          promiseResolve(outArray)
        }
      })

      for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        searchTerm = 'fetch('
        if (line.includes(searchTerm)) {
          // console.log(`Line from file (index ${line.indexOf(searchTerm)}): ${line}`);
          // extract endpoint from code
          // End of resource is just before , or )
          const tempLine = line.slice(
            searchTerm.length + line.indexOf(searchTerm) + 1
          )
          if (tempLine.indexOf(',') > 0) { outArray.push(tempLine.slice(0, tempLine.indexOf(',') - 1)) } else if (tempLine.indexOf(')') > 0) { outArray.push(tempLine.slice(0, tempLine.indexOf(')') - 1)) } else console.log('fetch found but unable to find end of resource')
        }
      }
    }
  )
  return promise
}

module.exports = processLineByLine
