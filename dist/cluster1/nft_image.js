"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wba_wallet_json_1 = __importDefault(require("../wba-wallet.json"));
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const umi_uploader_bundlr_1 = require("@metaplex-foundation/umi-uploader-bundlr");
const promises_1 = require("fs/promises");
// Create a devnet connection
const umi = (0, umi_bundle_defaults_1.createUmi)('https://api.devnet.solana.com');
const bundlrUploader = (0, umi_uploader_bundlr_1.createBundlrUploader)(umi);
(async () => {
    let keypair = await umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wba_wallet_json_1.default));
    console.log(`${keypair.publicKey}`);
    const signer = (0, umi_1.createSignerFromKeypair)(umi, keypair);
    umi.use((0, umi_1.signerIdentity)(signer));
    try {
        const content = await (0, promises_1.readFile)("./cluster1/generug.png");
        const image = (0, umi_1.createGenericFile)(content, "generug.png", { contentType: "image/png" });
        const [myUri] = await bundlrUploader.upload([image]);
        console.log("Your image URI: ", myUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
