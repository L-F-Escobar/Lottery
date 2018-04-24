const path = require('path');//Path module guarantees cross platform compatability
const fs = require('fs'); // File System
const solc = require('solc'); // Solc compiler

// _dirname : take you from your root directory on your phome directory all the way to the CompleteDevelopersGuide folder
/// @dev inboxPath will point directly to the Inbox.sol file no matter what system is used.
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol')

/// @dev Will contain all the source code of the contract file.
const source = fs.readFileSync(inboxPath, 'utf8')

/// @dev Has 2 properties being exported, ABI & Byte Code.
module.exports = solc.compile(source, 1).contracts[':Inbox'];
/// @dev Will display the contracts byte code only.
// console.log(solc.compile(source, 1).contracts[':Inbox']['bytecode']);