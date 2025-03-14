# Backup Tool Coding Challenge
Utilizes `Node.js`, `SQLite`, and `Jest` to build and test a command-line **file backup tool** that can take snapshots of a directory, store its contents in a database and support incremental backups.

### Why Node.JS & SQLite?
Node.JS was chosen primarily because my career focus up to this point has been focused in front-end development and I'm much more comfortable using JavaScript over Python - which would be a common language choice for this challenge as Python has a number of built in libraries that can simplify building this sort of interface. 

SQLite was chosen for this implementation due to being lightweight (just needs a singe file to implement) and not requiring a separate server process.


## Operations
### `snapshot`
Takes a snapshot of all files in the specified directory and stores their content and filenames in a database.

# Necessary tasks/functions to operate:
• Hash file contents - uses SHA-256 to hash file contents*
• Deduplicate data by checking existing hashes before storage 
• Store snapshots and file contents - Uses SQLite (via `better-sqlite3`) for storage
• use the `snapshot` command in CLI - the `commander` package handles this for us
* *is handled in `/utils.js`*


### `list`

Lists snapshots that are stored in the database.


### `restore`

Restores the directory state from any previous snapshot into a new directory.

### `prune`

Removes old snapshots from the database and deletes any unreferenced data.

