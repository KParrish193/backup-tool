import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

// Utils.js to manage file details & hashing to streamline 
// Calculate SHA-256 hash of a file's content
var calculateHash = (filePath) => {
    const hash = createHash('sha256'); // create a SHA-256 hash object
    const fileData = readFileSync(filePath); //read file into memory 
    hash.update(fileData); // update hash with file data 
    return hash.digest('hex'); // convert hash to hex string
}

// Recursively traverses a directory and collect file paths
var traverseDirectory = (dir) => {
    let files = []; // initialize empty files list 
    const items = fs.readdirSync(dir); // get list of items from dir
    
    for (const i of items) {
        const fullPath = path.join(dir, i); //concatenate i's full path
        if(fstat.statSync(fullPath).isDirectory()) {
            // if i is a directory, get files
            files = files.concat(traverseDirectory(fullPath));
        } else {
            // if i is a file, add to 'files' list
            files.push(fullPath)
        }
    }
    
    return files;
}

export default { calculateHash, traverseDirectory }