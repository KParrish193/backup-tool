import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

// Utils.js to manage file details & hashing to streamline 
// Calculate SHA-256 hash of a file's content
var calculateHash = (filePath) => {
    const hash = crypto.createHash('sha256'); // create a SHA-256 hash object
    const fileData = readFileSync(filePath); //read file into memory 
    hash.update(fileData); // update hash with file data 
    return hash.digest('hex'); // convert hash to hex string
}

// Recursively traverses a directory and collect file paths
var traverseDirectory = (dirPath) => {
    let fileList = []; // initialize empty files list 
    const items = fs.readdirSync(dirPath); // get list of items from dir
    
    items.forEach((item) => {
        const fullPath = path.join(dirPath, item); //concatenate i's full path
        const stats = fs.statSync(fullPath);

        if(stats.isDirectory()){
            // handles nested directories
            fileList = fileList.concat(traverseDirectory(fullPath));
        } else if(stats.isFile()){
            fileList.push(fullPath)
        }
    });
    
    return fileList;
}

export default { calculateHash, traverseDirectory }