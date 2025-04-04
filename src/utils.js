const fs = require('fs');
const crypto = require('crypto');
const db = require('./database');
const path = require('path');

// Utils.js to manage file details & hashing to streamline 
// Calculate SHA-256 hash of a file's content
const calculateHash = (filePath) => {
    const hash = crypto.createHash('sha256'); // create a SHA-256 hash object
    const fileData = fs.readFileSync(filePath); //read file into memory 
    hash.update(fileData); // update hash with file data 
    return hash.digest('hex'); // convert hash to hex string
}

// Recursively traverses a directory and collect file paths
const traverseDirectory = (dirPath) => {
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

// restore
const ensureDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true});
    }
}

async function getSnapshotFiles(snapshotId){
    const result = await db.all(
        'SELECT path, hash FROM files WHERE snpashot_id = ?',
        [snapshotId]
    );
    return result;
}

async function getFileContent(hash){
    const reault = await db.get(
        'SELECT content FROM contents WHERE hash = ?',
        [hash]
    );
    return result ? result.content : null;
}

module.exports = { calculateHash, traverseDirectory, ensureDirectory, getSnapshotFiles, getFileContent };