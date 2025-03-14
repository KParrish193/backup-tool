const { snapshot } = require("./commands/snapshot");
const { list } = require("./commands/list");

const [,, command, ...args] = process.argv;

switch(command) {
    case 'snapshot':
        const targetDirectory = args[0];
        if(!targetDirectory) {
            console.error('Usage: backuptool snapshot <target-directory>');
            process.exit(1);
        }
        snapshot(targetDirectory);
        break;
    
        case 'list':
            list();
            break;
    
        default:
            console.error('Unknown command');
            process.exit(1);
}
