import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SplTokenMinter } from "../target/types/spl_token_minter";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAssociatedTokenAccount,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { assert } from "chai";

describe("spl_token_minter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SplTokenMinter as Program<SplTokenMinter>;
  const wallet = provider.wallet as anchor.Wallet;

  let mint: anchor.web3.PublicKey;
  let userATA: anchor.web3.PublicKey;

  it("Is initialized!", async () => {
    // We will create a mint for testing
    mint = await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      6
    );

    userATA = await createAssociatedTokenAccount(
      provider.connection,
      wallet.payer,
      mint,
      wallet.publicKey
    );

    console.log("Mint created: ", mint.toBase58());
    console.log("User ATA: ", userATA.toBase58());
  });

  it("Mints tokens", async () => {
    const mintAmount = new anchor.BN(1000 * 10 ** 6);

    const tx = await program.methods
      .mintTokens(mintAmount)
      .accounts({
        mint: mint,
        destination: userATA,
        authority: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      } as any)
      .rpc();

    console.log("Mint tx: ", tx);

    const account = await getAccount(provider.connection, userATA);
    assert.equal(account.amount.toString(), mintAmount.toString());
  });

  it("Burns tokens", async () => {
    const burnAmount = new anchor.BN(500 * 10 ** 6);

    const tx = await program.methods
      .burnTokens(burnAmount)
      .accounts({
        mint: mint,
        source: userATA,
        authority: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      } as any)
      .rpc();

    console.log("Burn tx: ", tx);

    const account = await getAccount(provider.connection, userATA);
    const expectedRemaining = new anchor.BN(500 * 10 ** 6);
    assert.equal(account.amount.toString(), expectedRemaining.toString());
  });
});
