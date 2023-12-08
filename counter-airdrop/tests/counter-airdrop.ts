import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterAirdrop } from "../target/types/counter_airdrop";
import { Keypair, LAMPORTS_PER_SOL, Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import wallet from "../../wba-wallet.json";
import { createHash } from "crypto";

describe("counter-airdrop", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CounterAirdrop as Program<CounterAirdrop>;

  const provider = anchor.getProvider();

  const connection = new Connection("https://api.devnet.solana.com");

  const signer = Keypair.fromSecretKey(new Uint8Array(wallet));

  const username = signer.publicKey.toBase58();

  const hasher = createHash('sha256');
  hasher.update(Buffer.from(username));
  const hash = hasher.digest();

  const count = PublicKey.findProgramAddressSync([hash], program.programId)[0];

  const confirm = async (signature: string): Promise<string> => {
    const block = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction ({
      signature,
      ...block
    })
    return signature
  }

  const log = async(signature: string): Promise<string> => {
    console.log(`Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`);
    return signature;
  }

  xit("Airdrop", async() => {
    await provider.connection.requestAirdrop(signer.publicKey, LAMPORTS_PER_SOL * 10)
    .then(confirm)
    .then(log)
  })

  xit("Initialize", async () => {
    // Add your test here.
    const tx = await program.methods.
    initialize(username)
    .accounts({
      signer: signer.publicKey,
      count,
      systemProgram: SystemProgram.programId
    })
    .signers([
      signer
    ])
    .rpc()
    .then(confirm)
    .then(log)
  });

  it("Increment", async () => {
    const tx = await program.methods
    .increment(username)
    .accounts({
      signer: signer.publicKey,
      count,
      systemProgram: SystemProgram.programId
    })
    .signers([
      signer
    ])
    .rpc()
    .then(confirm)
    .then(log)
  });

  xit("Decrement", async () => {
    const tx = await program.methods
    .decrement(username)
    .accounts({
      signer: signer.publicKey,
      count,
      systemProgram: SystemProgram.programId
    })
    .signers([
      signer
    ])
    .rpc()
    .then(confirm)
    .then(log)
  });

});
