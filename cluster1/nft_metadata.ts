import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image: string = "https://arweave.net/rYiLbJ7mLLP4BHSPUNhTTSDRkLkQdHBCsssFnsQ_Zio"

        const metadata = {
            name: "Generug",
            symbol: "GRUG",
            description: "Rare exotic rug",
            image,
            attributes: [
                {
                    "trait_type": "Base Color", 
                    "value": "Purple"
                },
                {
                    "trait_type": "maincolor",
                    "value": "Purple"
                },
                {
                    "trait_type": "highlights",
                    "value": "Multicolor"
                }
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: [
                {
                "address": keypair.publicKey,
                "share": 100
                }
            ]
        };

        const myUri = await bundlrUploader.uploadJson(metadata)
        console.log("Your Metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();