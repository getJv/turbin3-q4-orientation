import {
    Transaction, SystemProgram, Connection, Keypair,
    LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey
} from "@solana/web3.js"
import wallet from "./dev-wallet.json"

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

const to = new PublicKey("oXpuQGDhjFAYMefAr7jagK6rth4QhJp2tD61fB2Zw4D");

const connection = new Connection("https://api.devnet.solana.com");
// test1: https://explorer.solana.com/tx/2tKTWPrhPvQ7F8HUhpy2ohXXMa3sqJ73fDwdZQ6eN1emkKy1Qb9BkRDv2an4tyQszYv7qsYKE1b7HRiErWqyhuAr?cluster=devnet
// test2: https://explorer.solana.com/tx/5RQmjjQ4TGF9WyrA33dXDz6JJx7C7J9ePDVb5ybrSapXvsSkqNxAJN2s8LSUKY7ZZYuiW9VtCXyAFrXkqKLEhESV?cluster=devnet
// test3: https://explorer.solana.com/tx/388LhwLocotrC91KM7Zfw8pjbauV3EDYMy3uTH41wihx1C6nta8tbDz6HU7FVhpSJiom3py72gJTxUFHVyWmTzK3?cluster=devnet
const accountConfirmation = async () => {
    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: LAMPORTS_PER_SOL / 100,
            })
        );
        transaction.recentBlockhash = (await

            connection.getLatestBlockhash('confirmed')).blockhash;

        transaction.feePayer = from.publicKey;
// Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
}
//accountConfirmation()

const transferAllTo = async () => {
    try {
        // Get balance of dev wallet
        const balance = await connection.getBalance(from.publicKey)
        // Create a test transaction to calculate fees
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance,
            })
        );
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;
        // Calculate exact fee rate to transfer entire SOL amount out  of account minus fees
        const fee = (await  connection.getFeeForMessage(transaction.compileMessage(),'confirmed')).value || 0;
        // Remove our transfer instruction to replace it
        transaction.instructions.pop();

        // Now add the instruction back with correct amount of lamports
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            })
        );

        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
}
//transferAllTo();
