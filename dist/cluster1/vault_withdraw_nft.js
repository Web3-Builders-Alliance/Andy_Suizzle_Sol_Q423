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
// Import our keypair from the wallet file
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(wba_wallet_json_1.default));
// Commitment
const commitment = "finalized";
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
// Mint address
const mint = new web3_js_1.PublicKey("AZRiRxvkcCTbDGfFc3UwnUj2xu3nsDcKUFrBuTdPxDGe");
// Execute our withdraw NFT transaction
(async () => {
    try {
        const metadataProgram = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
        const metadataAccount = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("metadata"), metadataProgram.toBuffer(), mint.toBuffer()], metadataProgram)[0];
        const masterEdition = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("metadata"),
            metadataProgram.toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition"),
        ], metadataProgram)[0];
        // Get the token account of the fromWallet address, and if it does not exist, create it
        //const ownerAta="61QVv2DAVUgSrjyGMDa93kGhjhoU8LtLarChKyeoAUf1";
        const ownerAta = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, keypair.publicKey);
        // Get the token account of the toWallet address, and if it does not exist, create it
        const vaultAta = await (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, keypair, mint, vaultAuth, true, commitment);
        const signature = await program.methods
            .withdrawNft()
            .accounts({
            owner: keypair.publicKey,
            ownerAta: ownerAta.address,
            vaultState,
            vaultAuth,
            vaultAta: vaultAta.address,
            tokenMint: mint,
            nftMetadata: metadataAccount,
            nftMasterEdition: masterEdition,
            metadataProgram: metadataProgram,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .signers([
            keypair
        ]).rpc();
        console.log(`Withdraw NFT success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    }
    catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
