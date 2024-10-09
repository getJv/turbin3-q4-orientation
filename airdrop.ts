import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import wallet from "./dev-wallet.json"

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");
console.log(keypair.publicKey.toString())
// https://explorer.solana.com/tx/5iZn1DXCqCcWz6C31gRA6E6TQKGyDgW8oW5Z725guHz9gL4bQJoacEcwJdrrLVbmYcfpyb4TM2YFJEz3b8pSckbR?cluster=devnet
// https://explorer.solana.com/tx/2uuQWrzMnwrMHFvu2BfPpJRPM2G1ZhGpEeLxUHQzYuFm?cluster=devnet

/*(async () => {
    try {
        // We're going to claim 2 devnet SOL tokens
        const txhash = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);

        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();*/
