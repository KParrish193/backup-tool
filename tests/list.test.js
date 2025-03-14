const { setupDatabase } = require('../src/database');
const { snapshot } = require('../src/commands/snapshot');
const { list } = require('../src/commands/list');
// const { restore } = require('../src/commands/restore');
// const { prune } = require('../commands/prune');

const fs = require('fs');
const path = require('path');

describe('list', () => {
    const testDir = path.join(__dirname, 'test_data');

    beforeAll(()=> {
        // setup a test directory
        if(!fs.existsSync(testDir)){
            fs.mkdirSync(testDir)
        }
        fs.writeFileSync(path.join(testDir, 'file1.text'), 'Hello World');
        fs.writeFileSync(path.join(testDir, 'file2.text'), 'Backup Tool Testing');
    });

    afterAll(() => {
        // Clean up test directory
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    test('should list snapshots correctly', () => {
        const db = setupDatabase();

        // clear previous snapshots
        db.prepare('DELETE FROM snapshots').run();

        // take a snapshot to populate the list
        snapshot(testDir);

        // capture output
        console.log = jest.fn();

        list();

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('SNAPSHOT TIMESTAMP'));
    })
})