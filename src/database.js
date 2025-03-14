import Database from 'better-sqlite3';

const DB_PATH = 'backup.db';

const setupDatabase = () => {
    // connect to the database, or create if it doesn't already exist
    const db = new(Database(DB_PATH));

    // create snapshots table
    db.prepare(`
    
    `).run();

    // create the files table
    db.prepare(`
    
    `).run();

    // create the contents table to store file data 
    db.prepare(`
    
    `).run();

    return db;
}

module.exports = { setupDatabase };