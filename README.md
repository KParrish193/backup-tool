# Backup Tool Coding Challenge
Utilizes `Node.js`, `SQLite`, and `Jest` to build and test a command-line **file backup tool** that can take snapshots of a directory, store its contents in a database and support incremental backups.



## Setup



## CLI Commands
### `backuptool snapshot --<target-directory>`
Takes a snapshot of all files in the specified directory and stores their content and filenames in a database.

### `backuptool list`
Lists snapshots that are stored in the database.

### `backuptool restore --<snapshot-id>`
Restores the directory state from any previous snapshot into a new directory.

### `backuptool prune --<snapshot-id>`
Removes old snapshots from the database and deletes any unreferenced data.



## Deep Dive into Coding Decisions - Why Node.JS & SQLite?
### Node.JS 
Node.JS was chosen primarily because my career focus up to this point has been focused in front-end development and I'm much more comfortable using JavaScript over Python - which would be a common language choice for this challenge as Python has a number of built in libraries that can simplify building this sort of interface. Additionally, GridUnity lists Node.js as a part of their code stack, so it made sense to follow suit for this challenge.

### SQLite
SQLite was chosen for this implementation due to being a lightweight, file-based database that doesn't require a separate server process. We're able to implement with a single file (`backup.db`), while still handling fast reading and writing functions.


## Data structure: 
For this tool to work, we need to store `snapshots`, `files`, and `contents`. The `snapshot` table stores data about each snapshot - an automatically incremented integer for a unique identifier, and a timestamp for sorting and displaying snapshots. The `files` table helps us track which files are a part of each snapshot (linking each file to a specific snapshot_id), recreate the original directory structure, and includes a hash that allows us to detect duplicates. The `contents` table stores the contents identified by their hash - allowing for access by multiple snapshots, while providing efficient storage (storing each file's content only once, regardless of how many snapshots it appears in).

### How does this structure work within the required commands?:
* Taking a Snapshot
    • Create a new entry in the `snapshots` table
    • For each file, generate its hash and check if the content already exists in the `contents` table
        • If not, store the content using its hash as as the key
    • Link the file path and hash to the snapshot_id in the `files` table.

* Restoring a Snapshot
    • Look up all te file paths and hashes linked to the specified snapshot_id
    • Retrieve the file contents using the hash from the `contents` table
    • recreate the directory structure and restore each file

* Pruning old Snapshots
    • Delete the specified snapshot and its associated file records from `files`
    • Check if the hashes from the deleted snapshot are still referenced by other snapshots
    • If not, remove from `contents`
