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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
const wba_wallet_json_1 = __importDefault(require("../../wba-wallet.json"));
const crypto_1 = require("crypto");
describe("counter-airdrop", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.CounterAirdrop;
    const provider = anchor.getProvider();
    const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
    const signer = web3_js_1.Keypair.fromSecretKey(new Uint8Array(wba_wallet_json_1.default));
    const username = signer.publicKey.toBase58();
    const hasher = (0, crypto_1.createHash)('sha256');
    hasher.update(Buffer.from(username));
    const hash = hasher.digest();
    const count = web3_js_1.PublicKey.findProgramAddressSync([hash], program.programId)[0];
    const confirm = async (signature) => {
        const block = await provider.connection.getLatestBlockhash();
        await provider.connection.confirmTransaction({
            signature,
            ...block
        });
        return signature;
    };
    const log = async (signature) => {
        console.log(`Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`);
        return signature;
    };
    xit("Airdrop", async () => {
        await provider.connection.requestAirdrop(signer.publicKey, web3_js_1.LAMPORTS_PER_SOL * 10)
            .then(confirm)
            .then(log);
    });
    xit("Initialize", async () => {
        // Add your test here.
        const tx = await program.methods.
            initialize(username)
            .accounts({
            signer: signer.publicKey,
            count,
            systemProgram: web3_js_1.SystemProgram.programId
        })
            .signers([
            signer
        ])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Increment", async () => {
        const tx = await program.methods
            .increment(username)
            .accounts({
            signer: signer.publicKey,
            count,
            systemProgram: web3_js_1.SystemProgram.programId
        })
            .signers([
            signer
        ])
            .rpc()
            .then(confirm)
            .then(log);
    });
    xit("Decrement", async () => {
        const tx = await program.methods
            .decrement(username)
            .accounts({
            signer: signer.publicKey,
            count,
            systemProgram: web3_js_1.SystemProgram.programId
        })
            .signers([
            signer
        ])
            .rpc()
            .then(confirm)
            .then(log);
    });
});
