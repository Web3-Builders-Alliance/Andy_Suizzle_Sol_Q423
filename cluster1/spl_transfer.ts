import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("9R69N8GnLkbo76q3oVM5xPMi5Spkz7hmKAvpZMpd7t2h");

// Recipient address
const to = new PublicKey("HM2AULAh4HaD1ACdkpuBaF84sfRhS1zVABcG3VRh55nM");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        // Create an ATA
        const ata1 = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey)

        // Get the token account of the toWallet address, and if it does not exist, create it
// Create an ATA
        const ata2 = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to)

        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await transfer(connection, keypair, ata1.address, ata2.address, keypair.publicKey, 1000000);
        console.log(`Success! Check out your transfer tx: https://explorer.solana.com/tx/${transferTx}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();