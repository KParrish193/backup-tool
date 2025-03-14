const { setupDatabase } = require('../database');
const { calculateHash, traverseDirectory } = require('../utils');
const fs = require('fs');
const path = require('path');


const snapshot = (targetDirectory) => {
    const db = setupDatabase();
    const timestamp = new Date().toISOString();

    // Insert a new snapshot entry
    const insertSnapshot = db.prepare('INSERT INTO snapshots (timestamp) VALUES (?)');
    const result = insertSnapshot.run(timestamp);
    const snapshotId = result.lastInsertRowid;

    const files = traverseDirectory(targetDirectory);
    const insertContent = db.prepare('INSERT OR IGNORE INTO contents (hash, data) VALUES (?, ?)');
    const insertFile = db.prepare('INSERT INTO files (snapshot_id, file_path, hash) VALUES (?, ?, ?)');

    files.forEach((filePath) => {
        const fileHash = calculateHash(filePath);
        const fileData = fs.readFileSync(filePath);

        // store the file content (only if not already present)
        insertContent.run(fileHash, fileData);

        // store the file record linking it to the snapshot
        insertFile.run(snapshotId, filePath, fileHash)
    });

    console.log(`Snapshot ${snapshotId} created at ${timestamp}`);
}

module.exports = { snapshot };