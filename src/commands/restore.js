const fs = require('fs');
const path = require('path');
const { getSnapshotFiles, getFileContent, ensureDirectory } = require('../utils');

async function restore(snapshotId, outputDir){
    try {
        const files = await getSnapshotFiles(snapshotId);

        if(files.length === 0) {
            console.error(`No files found for snapshot ${snapshotId}`);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(outputDir, file.path);
            ensureDirectory(path.dirname(filePath));

            const content = getFileContent(file.hash);
            fs.writeFileSync(filePath, content);
        })
    } catch(err){
        console.error(`Error restoring snapshot ${snapshotId}: ${err.message}`);
    }
}

module.exports = { restore };