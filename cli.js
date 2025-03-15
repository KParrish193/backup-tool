#!/usr/bin/env node

const { Command } = require('commander');

// commands
const { snapshot } = require('./src/commands/snapshot');
const { list } = require('./src/commands/list');
const { restore } = require('./src/commands/restore');
const { prune } = require("./src/commands/prune");

const program = new Command();

program
    .name('backuptool')
    .description('CLI backup tool')
    .version('1.0.0');

program
    .command('snapshot')
    .description('Take a snapshot of the target directory')
    .option('--target <path>', 'Directory to snapshot')
    .action((targetDirectory) => {
        if(!targetDirectory){
            console.error('Error: --target is required');
            process.exit(1);
        }
        snapshot(targetDirectory);
    });

program
    .command('list')
    .description('List all snapshots')
    .action(()=> {
        list();
    });

program
    .command('restore')
    .option('--snapshot-id <number>, snapshotID to restore')
    .option('--output-directory <path>', 'Directory to restore to')
    .action((snapshotId, outputDirectory) => {
        if(!snapshotId || !outputDirectory){
            console.error('Error: --snapshot-id and --output-directory are required');
            process.exit(1);
        }
        restore(snapshotId, outputDirectory);
    });

program
    .command('prune')
    .description('Prune snapshot by ID')
    .option('--snapshot-id <number>', 'snapshotID to prune')
    .action((snapshotId) => {
        if(!snapshotId){
            console.error('Error: --snapshot-id is required');
            process.exit(1);
        }
        prune(snapshotId);
    });

program.parse(process.argv);
