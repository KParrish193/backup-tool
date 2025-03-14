const { setupDatabase } = require('../database');

const list = () => {
    const db = setupDatabase();
    
    const snapshotQuery = db.prepare('SELECT id, timestamp FROM snapshots ORDER BY id ASC');
    const snapshots = snapshotQuery.all();

    console.log('SNAPSHOT TIMESTAMP');
    snapshots.forEach((snapshot) => {
        console.log(`${snapshot.id} ${snapshot.timestamp}`);
    });
}

module.exports = { list };