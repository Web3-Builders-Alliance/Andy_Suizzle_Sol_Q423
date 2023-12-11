"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const wba_vault_1 = require("../programs/wba_vault");
const wba_wallet_json_1 = __importDefault(require("../wba-wallet.json"));
// Import our keypair from the wallet file
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(wba_wallet_json_1.default));
// Commitment
const commitment = "confirmed";
// Create a devnet connection
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
// Create our anchor provider
const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(keypair), {
    commitment,
});
// Create our program
const program = new anchor_1.Program(wba_vault_1.IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o", provider);
// Vault state
const vaultState = new web3_js_1.PublicKey("8maCFMojcM3gMn2xk3gbG2YkNegciMNvfnqBbNE4WpgE");
// Create a random keypair
const closeVaultState = new web3_js_1.PublicKey("8maCFMojcM3gMn2xk3gbG2YkNegciMNvfnqBbNE4WpgE");
(async () => {
    try {
        const signature = await program.methods
            .closeAccount()
            .accounts({
            owner: keypair.publicKey,
            closeVaultState: closeVaultState,
            vaultState: vaultState,
            systemProgram: web3_js_1.SystemProgram.programId
        })
            .signers([
            keypair
        ]).rpc();
        console.log(`Close success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    }
    catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
