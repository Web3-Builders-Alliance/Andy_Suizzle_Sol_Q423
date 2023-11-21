const bs58 = require('bs58');

const secret = '[secret key goes here. Don't forget to delete when you're done.]';
const bytes = bs58.decode(secret);
// See uint8array-tools package for helpful hex encoding/decoding/compare tools
//console.log(Buffer.from(bytes).toString('hex'))
console.log(`${bytes}`);
