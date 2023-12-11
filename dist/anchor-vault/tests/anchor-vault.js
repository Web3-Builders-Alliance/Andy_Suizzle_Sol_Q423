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
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const wba_wallet_json_1 = __importDefault(require("../../wba-wallet.json"));
describe("anchor-vault", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.AnchorVault;
    const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
    const signer = web3_js_1.Keypair.fromSecretKey(new Uint8Array(wba_wallet_json_1.default));
    const vault = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("vault"), signer.publicKey.toBuffer()], program.programId)[0];
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
    it("Airdrop", async () => {
        await connection.requestAirdrop(signer.publicKey, web3_js_1.LAMPORTS_PER_SOL * 10)
            .then(confirm)
            .then(log);
    });
    it("Deposit", async () => {
        const tx = await program.methods
            .deposit(new anchor_1.BN(web3_js_1.LAMPORTS_PER_SOL))
            .accounts({
            signer: signer.publicKey,
            vault,
            systemProgram: web3_js_1.SystemProgram.programId
        })
            .signers([
            signer
        ])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Withdraw", async () => {
        const tx = await program.methods
            .withdraw(new anchor_1.BN(web3_js_1.LAMPORTS_PER_SOL))
            .accounts({
            signer: signer.publicKey,
            vault,
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
