import { Command } from 'commander';
import { setupDatabase } from '../database';
import { calculateHash, traverseDirectory } from '../utils';
import fs from 'fs';

const program = new Command();

const snapshot = (directory) => {
    const db = setupDatabase();
    const timestamp = new Date().toISOString();
    const insertSnapshot = db.prepare("INSERT INTO snapshots (timestamp) VALUES (?)");
    const snapshotId = insertSnapshot.run(timestamp).lastInsertRowid; 

    const insertFile = db.prepare("INSERT INTO files (snapshot_id, file_path, hash) VALUES (?, ?, ?)");
    const insertContent = db.prepare("INSERT INTO contents (hash, data) VALUES (?, ?)");
    const checkContent = db.prepare("SELECT hash FROM contents WHERE hash = ?");

    const files = traverseDirectory(directory);

    for (const filePath of files){
        const fileHash = calculateHash(filePath);

        if(!checkContent.get(fileHash)) {
            const fileData = fs.readFileSync(filePath);
            insertContent.run(fileHash, fileData);
        }
    }

    console.log(`Snapshot ${snapshotId} created for ${directory}`)
    db.close();
}

program
    .command('snapshot <directory>')
    .description('Take a snapshot of a directory')
    .action(snapshot);

program.parse(process.argv);