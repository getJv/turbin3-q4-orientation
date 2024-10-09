import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import wallet from "./Turbin3-wallet.json";
import {IDL, Turbin3Prereq} from "./programs/Turbin3_prereq";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");

const github = Buffer.from("getjv", "utf8");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed",
});

const program: Program<Turbin3Prereq> = new Program(IDL, provider);

const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
    enrollment_seeds,
    program.programId,
);
// send: https://explorer.solana.com/tx/2ynoWKY6Xby6RQF4NGfGeSdtfSH5P8nqxECwFWXqkGEccjqDjovHapFVXUSAvFJcGMA9KczbM1Sp2CgjtScsCEDC?cluster=devnet
(async () => {
    try {
        const txhash = await program.methods
            .complete(github)
            .accounts({
                signer: keypair.publicKey,
            })
            .signers([keypair])
            .rpc();
        console.log(`Success! Check out your TX here:
  https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
