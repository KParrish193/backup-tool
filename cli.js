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
    .option('--target-directory <path>', 'Directory to snapshot')
    .action((options) => {
        if(!options.targetDirectory){
            console.error('Error: --target-directory is required');
            process.exit(1);
        }
        snapshot(options.targetDirectory);
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
    .action((options) => {
        if(!options.snapshotId || !options.outputDirectory){
            console.error('Error: --snapshot-id and --output-directory are required');
            process.exit(1);
        }
        restore(parseInt(options.snapshotId), options.outputDirectory);
    });

program
    .command('prune')
    .description('Prune snapshot by ID')
    .option('--snapshot-id <number>', 'snapshotID to prune')
    .action((options) => {
        if(!options.snapshotId){
            console.error('Error: --snapshot-id is required');
            process.exit(1);
        }
        prune(parseInt(options.snapshotId));
    });

program.parse(process.argv);



