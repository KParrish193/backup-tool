const { setupDatabase } = require('../database');
const { calculateHash, traverseDirectory } = require('../utils');
const fs = require('fs');
const path = require('path');


const snapshot = (targetDirectory) => {
    const db = setupDatabase();
    const timestamp = new Date().toISOString();

    // Insert a new snapshot entry
    const snapshotStats = db.prepare("INSERT INTO snapshots (timestamp) VALUES (?)");
    const result = snapshotStats.run(timestamp);
    const snapshotId = result.lastInsertRowid; 

    const files = traverseDirectory(targetDirectory);

    files.forEach((filePath) => {
        const relativePath = path.relative(process.cwd(), filePath);
        const fileHash = calculateHash(filePath);

        // check if the content already exists in the 'contents' table
        const checkContent = db.prepare('SELECT hash FROM contents WHERE hash = ?')
        const contentExists = checkContent.get(hash);

        // if content doesn't exist, add it
        if(!contentExists){
            const fileData = fs.readFileSync(filePath);
            const insertContent = db.prepare('INSERT INTO contents (hash, data) VALUES (?, ?)');
            insertContent.run(fileHash, fileData);
        }

        const insertFile = db.prepare('INSERT INTO files (snapshot_id, file_path, hash) VALUES (?, ?, ?)');
        insertFile.run(snapshotId, relativePath, fileHash);
        console.log(`Snapshot: stored ${relativePath}`)
    })

    console.log(`Snapshot complete! Snapshot ID: ${snapshotId}`)
}

module.exports = { snapshot };