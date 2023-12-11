const bs58 = require('bs58');

const secret = '7aewfu5H3ux3RqaLrBU3FUTrNf2T8LSZsJubWtVuqG9HTyB2vFcBM14zqFAPEidznvGUcKKkBLVS9iVCZhoYoBe';
const bytes = bs58.decode(secret);
// See uint8array-tools package for helpful hex encoding/decoding/compare tools
//console.log(Buffer.from(bytes).toString('hex'))
console.log(`${bytes}`);
