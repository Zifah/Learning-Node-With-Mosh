const fs = require('fs');

fs.readdir('./', printFiles);

function printFiles(error, files){
    if(error) console.log('Error', error);
    else console.log('Result', files);
}