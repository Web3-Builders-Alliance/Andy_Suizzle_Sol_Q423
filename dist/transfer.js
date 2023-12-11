"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const dev_wallet_json_1 = __importDefault(require("./dev-wallet.json"));
// Import dev wallet keypair from wallet file
const from = web3_js_1.Keypair.fromSecretKey(new Uint8Array(dev_wallet_json_1.default));
// Define WBA public key 
const to = new web3_js_1.PublicKey("HM2AULAh4HaD1ACdkpuBaF84sfRhS1zVABcG3VRh55nM");
//Create a Solana devnet connection
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
(async () => {
    try {
        // Get balance of dev wallet
        const balance = await connection.getBalance(from.publicKey);
        // Create a test tx to calculate fees
        const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: balance,
        }));
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;
        // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
        const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;
        // Remove our transfer instruction to replace it
        transaction.instructions.pop();
        // Add transaction with correct amount of lamports
        transaction.add(web3_js_1.SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: balance - fee,
        }));
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;
        // Sign tx, broadcast, confirm
        const signature = await (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [from]);
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx${signature}?cluster=devnet`);
    }
    catch (e) {
        console.error(`Oops, something went wrong:${e}`);
    }
})();
