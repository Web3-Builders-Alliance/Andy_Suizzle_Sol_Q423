"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const wba_wallet_json_1 = __importDefault(require("../wba-wallet.json"));
const spl_token_1 = require("@solana/spl-token");
// We're going to import our keypair from the wallet file
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(wba_wallet_json_1.default));
//Create a Solana devnet connection
const commitment = "confirmed";
const connection = new web3_js_1.Connection("https://api.devnet.solana.com", commitment);
// Mint address
const mint = new web3_js_1.PublicKey("9R69N8GnLkbo76q3oVM5xPMi5Spkz7hmKAvpZMpd7t2h");
// Recipient address
const to = new web3_js_1.PublicKey("HM2AULAh4HaD1ACdkpuBaF84sfRhS1zVABcG3VRh55nM");
(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        // Create an ATA
        const ata1 = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, keypair.publicKey);
        // Get the token account of the toWallet address, and if it does not exist, create it
        // Create an ATA
        const ata2 = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, to);
        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await (0, spl_token_1.transfer)(connection, keypair, ata1.address, ata2.address, keypair.publicKey, 1000000);
        console.log(`Success! Check out your transfer tx: https://explorer.solana.com/tx/${transferTx}?cluster=devnet`);
    }
    catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
