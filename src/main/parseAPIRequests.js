const fs = require('fs');
const readline = require('readline');
const path = require('path');
const testDir = '../../../scratch/client';

function processLineByLine() {
  const outArray = [];
  fs.readdirSync(testDir).forEach(async (file, i, arr) => {
    const fileStream = fs.createReadStream(
      path.resolve(__dirname, testDir, file)
    );

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    rl.on('close', () => {
      if (i === arr.length - 1) {
        console.log(outArray);
        return outArray;
      }
    });

    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      searchTerm = 'fetch(';
      if (line.includes(searchTerm)) {
        // console.log(`Line from file (index ${line.indexOf(searchTerm)}): ${line}`);
        // extract endpoint from code
        // End of resource is just before , or )
        let tempLine = line.slice(
          searchTerm.length + line.indexOf(searchTerm) + 1
        );
        if (tempLine.indexOf(',') > 0)
          outArray.push(tempLine.slice(0, tempLine.indexOf(',') - 1));
        else if (tempLine.indexOf(')') > 0)
          outArray.push(tempLine.slice(0, tempLine.indexOf(')') - 1));
        else console.log('fetch found but unable to find end of resource');
      }
    }

    // Do something at the end of the filestream
  });
}

console.log(processLineByLine());
