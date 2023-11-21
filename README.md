# Andy_Suizzle_Sol_Q423

Create `dev-wallet.json` and `wba-wallet.json` files. 

Run `yarn tsc --init --rootDir ./ --outDir ./dist --esModuleInterop --lib
ES2019 --module commonjs --resolveJsonModule true --noImplicitAny true` to create `tsconfig.json`, `yarn.lock` and `package-lock.json`.

To create a wallet byte array, add a secret key to `base58-to-bytes.ts` and run `yarn base58-to-bytes`.
