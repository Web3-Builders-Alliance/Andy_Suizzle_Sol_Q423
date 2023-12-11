import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { AnchorEscrow } from "../target/types/anchor_escrow";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createAssociatedTokenAccountIdempotentInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddress, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptAccount, getMinimumBalanceForRentExemptMint, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { randomBytes } from "crypto";

import wallet from "../../wba-wallet.json";

describe("anchor-escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const { connection } = provider;

  const program = anchor.workspace.AnchorEscrow as Program<AnchorEscrow>;

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block
    })
    return signature
  }

  const log = async(signature: string): Promise<string> => {
    console.log(`Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`);
    return signature;
  }

  const seed = new BN(randomBytes(8));

  const maker = Keypair.fromSecretKey(new Uint8Array(wallet));
  const taker = Keypair.fromSecretKey(new Uint8Array(wallet));
  const mintA = Keypair.generate();
  const mintB = Keypair.generate();
  const makerAtaA = getAssociatedTokenAddressSync(mintA.publicKey, maker.publicKey);
  const makerAtaB = getAssociatedTokenAddressSync(mintB.publicKey, maker.publicKey);  
  const takerAtaA = getAssociatedTokenAddressSync(mintA.publicKey, taker.publicKey);
  const takerAtaB = getAssociatedTokenAddressSync(mintB.publicKey, taker.publicKey);
  const escrow = PublicKey.findProgramAddressSync([
    Buffer.from("escrow"),
    maker.publicKey.toBuffer(),
    seed.toBuffer('le', 8)    
  ],
  program.programId)[0];
  const vault = getAssociatedTokenAddressSync(mintA.publicKey, escrow, true);

  xit("Airdrop", async () => {
    await Promise.all([
      await connection.requestAirdrop(maker.publicKey, LAMPORTS_PER_SOL * 10)
      .then(confirm),
      await connection.requestAirdrop(taker.publicKey, LAMPORTS_PER_SOL * 10)
      .then(confirm)
    ])
  })

  it("Make", async () => {
    let tx = new Transaction();
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
      tx.instructions = [
        SystemProgram.createAccount({
          fromPubkey: provider.publicKey,
          newAccountPubkey: mintA.publicKey,
          lamports: 0,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID
        }),
        SystemProgram.createAccount({
          fromPubkey: provider.publicKey,
          newAccountPubkey: mintB.publicKey,
          lamports: 0,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID
        }),
        createInitializeMint2Instruction(
          mintA.publicKey,
          6,
          maker.publicKey,
          null
        ),
        createInitializeMint2Instruction(
          mintB.publicKey,
          6,
          taker.publicKey,
          null
        ),
        createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        makerAtaA,
        maker.publicKey,
        mintA.publicKey
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        takerAtaA,
        taker.publicKey,
        mintB.publicKey  
      ),  
      createMintToInstruction (
        mintA.publicKey,
        makerAtaA,
        maker.publicKey,
        1e9
      ),
      createMintToInstruction (
        mintB.publicKey,
        takerAtaB,
        maker.publicKey,
        1e9
      )
    ];

    await provider.sendAndConfirm(tx, [
      mintA, mintB, maker, taker
    ]).then(log);
})
});
