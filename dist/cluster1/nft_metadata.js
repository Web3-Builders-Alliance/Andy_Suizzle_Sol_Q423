"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wba_wallet_json_1 = __importDefault(require("../wba-wallet.json"));
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const umi_uploader_bundlr_1 = require("@metaplex-foundation/umi-uploader-bundlr");
// Create a devnet connection
const umi = (0, umi_bundle_defaults_1.createUmi)('https://api.devnet.solana.com');
const bundlrUploader = (0, umi_uploader_bundlr_1.createBundlrUploader)(umi);
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wba_wallet_json_1.default));
const signer = (0, umi_1.createSignerFromKeypair)(umi, keypair);
umi.use((0, umi_1.signerIdentity)(signer));
(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
        const image = "https://arweave.net/rYiLbJ7mLLP4BHSPUNhTTSDRkLkQdHBCsssFnsQ_Zio";
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
        const myUri = await bundlrUploader.uploadJson(metadata);
        console.log("Your Metadata URI: ", myUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
