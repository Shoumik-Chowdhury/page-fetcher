const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let url = process.argv[2];
let filePath = process.argv[3];

request(url, (error, response, body) => {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  let fileSize = body.length;

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    if (stats.size > 0) {
      rl.question('File exists, do you want to overwrite? (Y/N) ', (ans) => {
        if (ans === 'Y') {
          fs.writeFile(filePath, body, err => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}.`);
          });
        } else {
          console.log('File not copied!');
        }
        rl.close();
      });
    }
    fs.writeFile(filePath, body, err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}.`);
      rl.close();
    });
  });
});
