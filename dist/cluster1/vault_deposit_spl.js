"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const wba_vault_1 = require("../programs/wba_vault");
const wba_wallet_json_1 = __importDefault(require("../wba-wallet.json"));
const spl_token_1 = require("@solana/spl-token");
const token_1 = require("@coral-xyz/anchor/dist/cjs/utils/token");
// Import our keypair from the wallet file
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(wba_wallet_json_1.default));
// Commitment
const commitment = "finalized";
// What is up fam
// Create a devnet connection
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
// Create our anchor provider
const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(keypair), {
    commitment,
});
// Create our program
const program = new anchor_1.Program(wba_vault_1.IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o", provider);
// Create a random keypair
const vaultState = new web3_js_1.PublicKey("8maCFMojcM3gMn2xk3gbG2YkNegciMNvfnqBbNE4WpgE");
//Create the PDA for our deposit account
const vaultAuth = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("auth"), vaultState.toBuffer()], program.programId)[0];
// Create the vault key
const vault = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultAuth.toBuffer()], program.programId)[0];
const token_decimals = 1000000n;
// Mint address
const mint = new web3_js_1.PublicKey("9R69N8GnLkbo76q3oVM5xPMi5Spkz7hmKAvpZMpd7t2h");
// Execute our deposit SPL transaction
(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        //const ownerAta="61QVv2DAVUgSrjyGMDa93kGhjhoU8LtLarChKyeoAUf1";
        const ownerAta = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, keypair.publicKey);
        // Get the token account of the toWallet address, and if it does not exist, create it
        const vaultAta = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, vaultAuth, true, commitment);
        const signature = await program.methods
            .depositSpl(new anchor_1.BN(token_decimals))
            .accounts({
            owner: keypair.publicKey,
            ownerAta: ownerAta.address,
            vaultState,
            vaultAuth,
            vaultAta: vaultAta.address,
            tokenMint: mint,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            associatedTokenProgram: token_1.ASSOCIATED_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .signers([
            keypair
        ]).rpc();
        console.log(`Deposit success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    }
    catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
