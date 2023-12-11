"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wba_wallet_json_1 = __importDefault(require("../wba-wallet.json"));
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_1 = require("@metaplex-foundation/umi");
// Define our Mint address
const mint = (0, umi_1.publicKey)("9R69N8GnLkbo76q3oVM5xPMi5Spkz7hmKAvpZMpd7t2h");
// Create a UMI connection
const umi = (0, umi_bundle_defaults_1.createUmi)('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wba_wallet_json_1.default));
const signer = (0, umi_1.createSignerFromKeypair)(umi, keypair);
umi.use((0, umi_1.signerIdentity)((0, umi_1.createSignerFromKeypair)(umi, keypair)));
(async () => {
    try {
        let accounts = {
            mint,
            mintAuthority: signer
        };
        let data = {
            name: "Suizzle Coin",
            symbol: "SUIZ",
            uri: "",
            sellerFeeBasisPoints: 0,
            collection: null,
            creators: null,
            uses: null
        };
        let args = {
            data,
            isMutable: true,
            collectionDetails: null,
        };
        const tx = (0, mpl_token_metadata_1.createMetadataAccountV3)(umi, {
            ...accounts,
            ...args,
        });
        let result = await tx.sendAndConfirm(umi);
        console.log(result.signature);
    }
    catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
