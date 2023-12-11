"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor = __importStar(require("@coral-xyz/anchor"));
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const crypto_1 = require("crypto");
describe("anchor-escrow", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());
    const provider = anchor.getProvider();
    const { connection } = provider;
    const program = anchor.workspace.AnchorEscrow;
    const confirm = async (signature) => {
        const block = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            signature,
            ...block
        });
        return signature;
    };
    const log = async (signature) => {
        console.log(`Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`);
        return signature;
    };
    const seed = new anchor_1.BN((0, crypto_1.randomBytes)(8));
    const maker = web3_js_1.Keypair.generate();
    const taker = web3_js_1.Keypair.generate();
    const mintA = web3_js_1.Keypair.generate();
    const mintB = web3_js_1.Keypair.generate();
    const makerAtaA = (0, spl_token_1.getAssociatedTokenAddressSync)(mintA.publicKey, maker.publicKey);
    const makerAtaB = (0, spl_token_1.getAssociatedTokenAddressSync)(mintB.publicKey, maker.publicKey);
    const takerAtaA = (0, spl_token_1.getAssociatedTokenAddressSync)(mintA.publicKey, taker.publicKey);
    const takerAtaB = (0, spl_token_1.getAssociatedTokenAddressSync)(mintB.publicKey, taker.publicKey);
    const escrow = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from("escrow"),
        maker.publicKey.toBuffer(),
        seed.toBuffer('le', 8)
    ], program.programId)[0];
    const vault = (0, spl_token_1.getAssociatedTokenAddressSync)(mintA.publicKey, escrow, true);
    it("Airdrop", async () => {
        await Promise.all([
            await connection.requestAirdrop(maker.publicKey, web3_js_1.LAMPORTS_PER_SOL * 10)
                .then(confirm),
            await connection.requestAirdrop(taker.publicKey, web3_js_1.LAMPORTS_PER_SOL * 10)
                .then(confirm)
        ]);
    });
    it("Make", async () => {
        let tx = new web3_js_1.Transaction();
        const lamports = await (0, spl_token_1.getMinimumBalanceForRentExemptMint)(connection);
        tx.instructions = [
            web3_js_1.SystemProgram.createAccount({
                fromPubkey: provider.publicKey,
                newAccountPubkey: mintA.publicKey,
                lamports: 0,
                space: spl_token_1.MINT_SIZE,
                programId: spl_token_1.TOKEN_PROGRAM_ID
            }),
            web3_js_1.SystemProgram.createAccount({
                fromPubkey: provider.publicKey,
                newAccountPubkey: mintB.publicKey,
                lamports: 0,
                space: spl_token_1.MINT_SIZE,
                programId: spl_token_1.TOKEN_PROGRAM_ID
            }),
            (0, spl_token_1.createInitializeMint2Instruction)(mintA.publicKey, 6, maker.publicKey, null),
            (0, spl_token_1.createInitializeMint2Instruction)(mintB.publicKey, 6, taker.publicKey, null),
            (0, spl_token_1.createAssociatedTokenAccountIdempotentInstruction)(provider.publicKey, makerAtaA, maker.publicKey, mintA.publicKey),
            (0, spl_token_1.createAssociatedTokenAccountIdempotentInstruction)(provider.publicKey, takerAtaA, taker.publicKey, mintB.publicKey),
            (0, spl_token_1.createMintToInstruction)(mintA.publicKey, makerAtaA, maker.publicKey, 1e9),
            (0, spl_token_1.createMintToInstruction)(mintB.publicKey, takerAtaB, maker.publicKey, 1e9)
        ];
        await provider.sendAndConfirm(tx, [
            mintA, mintB, maker, taker
        ]).then(log);
    });
});
