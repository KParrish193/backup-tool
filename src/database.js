import Database from 'better-sqlite3';

const DB_PATH = 'backup.db';

const setupDatabase = () => {
    // connect to the database, or create if it doesn't already exist
    const db = new(Database(DB_PATH));

    // create snapshots table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT
        )
    `).run();

    // create the files table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            snapshot_id INTEGER,
            file_path TEXT,
            hash TEXT,
            FOREIGN KEY(spanshot_id) REFERENCES snapshots(id)
        )
    `).run();

    // create the contents table to store file data 
    db.prepare(`
        CREATE TABLE IF NOT EXISTS contents (
            hash TEXT PRIMARY KEY,
            data BLOB
        )
    `).run();

    return db;
}

module.exports = { setupDatabase };