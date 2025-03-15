const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backup.db');

const prune = (snapshotId) => {
    try {
        const db = new Database(dbPath);
        console.log(`Pruning Snapshot #${snapshotId}...`);

        // Delete the snapshot that matches supplied snapshotId from the snapshot table
        const deleteSnapshot = db.prepare(`DELETE FROM snapshots WHERE id = ?`);
        const result = deleteSnapshot.run(snapshotId);

        if(result.changes === 0) {
            console.log(`No snapshot found with ID ${snapshotId}`);
            db.close();
            return;
        }

        console.log(`Snapshot #${snapshotId} deleted`);

        // find orphaned files that are no longer referenced by deleted snapshot (or other snapshots)
        const orphanedFiles = db.prepare(`
            SELECT files.id FROM files
            LEFT JOIN snapshot_files ON files.id = snapshot_files.file_id
            WHERE snapshot_files.file_id IS NULL
        `).all();

        if(orphanedFiles.length === 0){
            console.log(`No orphaned files found.`);
            db.close();
            return;
        }

        // if no error and orphaned files exist, delete
        const fileIds = orphanedFiles.map(row => row.id);
        const placeholders = fileIds.map(() => '?').join(', ');
        
        const deleteOrphanedFiles = db.prepare(
            `DELETE FROM files WHERE id IN (${placeholders})`
        );

        const orphanedResult = deleteOrphanedFiles.run(...fileIds);
        
        console.log(`Deleted ${orphanedResult.changes} orphaned files.`);
        db.close();
    } catch(err) {
        console.error(`Error during prune operation: ${err.message}`);
    }
};

module.exports = { prune };