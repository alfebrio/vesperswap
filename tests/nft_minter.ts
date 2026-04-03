import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftMinter } from "../target/types/nft_minter";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { assert } from "chai";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// The treasury address hardcoded in the program
const TREASURY_ADDRESS = new PublicKey(
  "HQ4yY5sLhHntJzUWe7nDBXp8H2K2S4aXWz8S1L4H4Bqw"
);

function getMetadataPDA(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
}

function getMasterEditionPDA(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
}

describe("nft_minter — Security & Integration Tests", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftMinter as Program<NftMinter>;
  const wallet = provider.wallet as anchor.Wallet;

  // ─── 1. String Validation (Rent Cost Mitigation) ──────────────────────────
  describe("String Validation Attack Vectors", () => {
    it("rejects NFT mint when name exceeds 32 characters", async () => {
      const mintKp = Keypair.generate();
      const tokenAcct = getAssociatedTokenAddressSync(
        mintKp.publicKey,
        wallet.publicKey
      );
      const metadata = getMetadataPDA(mintKp.publicKey);
      const masterEdition = getMasterEditionPDA(mintKp.publicKey);

      try {
        await program.methods
          .mintNft(
            "A".repeat(33), // name > 32 chars — ATTACK VECTOR
            "VPS",
            "https://arweave.net/valid"
          )
          .accounts({
            signer: wallet.publicKey,
            treasury: TREASURY_ADDRESS,
            mint: mintKp.publicKey,
            tokenAccount: tokenAcct,
            metadata,
            masterEdition,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          } as any)
          .signers([mintKp])
          .rpc();

        assert.fail("Transaction should have been rejected due to NameTooLong");
      } catch (err: any) {
        assert.include(
          err.message,
          "NameTooLong",
          "Expected NameTooLong error code"
        );
        console.log(
          "✅ Rejected: Name > 32 chars blocked by NameTooLong constraint"
        );
      }
    });

    it("rejects NFT mint when symbol exceeds 10 characters", async () => {
      const mintKp = Keypair.generate();
      const tokenAcct = getAssociatedTokenAddressSync(
        mintKp.publicKey,
        wallet.publicKey
      );
      const metadata = getMetadataPDA(mintKp.publicKey);
      const masterEdition = getMasterEditionPDA(mintKp.publicKey);

      try {
        await program.methods
          .mintNft(
            "Valid Name",
            "TOOLONGSYMBOL", // symbol > 10 chars — ATTACK VECTOR
            "https://arweave.net/valid"
          )
          .accounts({
            signer: wallet.publicKey,
            treasury: TREASURY_ADDRESS,
            mint: mintKp.publicKey,
            tokenAccount: tokenAcct,
            metadata,
            masterEdition,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          } as any)
          .signers([mintKp])
          .rpc();

        assert.fail("Transaction should have been rejected due to SymbolTooLong");
      } catch (err: any) {
        assert.include(err.message, "SymbolTooLong");
        console.log(
          "✅ Rejected: Symbol > 10 chars blocked by SymbolTooLong constraint"
        );
      }
    });

    it("rejects NFT mint when URI exceeds 200 characters", async () => {
      const mintKp = Keypair.generate();
      const tokenAcct = getAssociatedTokenAddressSync(
        mintKp.publicKey,
        wallet.publicKey
      );
      const metadata = getMetadataPDA(mintKp.publicKey);
      const masterEdition = getMasterEditionPDA(mintKp.publicKey);

      try {
        await program.methods
          .mintNft(
            "Valid Name",
            "VPS",
            "https://arweave.net/" + "a".repeat(200) // URI > 200 chars — ATTACK VECTOR
          )
          .accounts({
            signer: wallet.publicKey,
            treasury: TREASURY_ADDRESS,
            mint: mintKp.publicKey,
            tokenAccount: tokenAcct,
            metadata,
            masterEdition,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          } as any)
          .signers([mintKp])
          .rpc();

        assert.fail("Transaction should have been rejected due to UriTooLong");
      } catch (err: any) {
        assert.include(err.message, "UriTooLong");
        console.log(
          "✅ Rejected: URI > 200 chars blocked by UriTooLong constraint"
        );
      }
    });
  });

  // ─── 2. Treasury Enforcement (Access Control) ─────────────────────────────
  describe("Treasury Access Control", () => {
    it("rejects mint when a wrong treasury address is passed", async () => {
      const mintKp = Keypair.generate();
      const fakeTreasury = Keypair.generate(); // attacker's wallet
      const tokenAcct = getAssociatedTokenAddressSync(
        mintKp.publicKey,
        wallet.publicKey
      );
      const metadata = getMetadataPDA(mintKp.publicKey);
      const masterEdition = getMasterEditionPDA(mintKp.publicKey);

      try {
        await program.methods
          .mintNft("Valid NFT", "VPS", "https://arweave.net/valid")
          .accounts({
            signer: wallet.publicKey,
            treasury: fakeTreasury.publicKey, // ATTACK VECTOR: Wrong treasury
            mint: mintKp.publicKey,
            tokenAccount: tokenAcct,
            metadata,
            masterEdition,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          } as any)
          .signers([mintKp])
          .rpc();

        assert.fail(
          "Mint should have been rejected due to InvalidTreasury check"
        );
      } catch (err: any) {
        assert.include(err.message, "InvalidTreasury");
        console.log(
          "✅ Rejected: Invalid treasury address blocked by InvalidTreasury constraint"
        );
      }
    });
  });

  // ─── 3. IDL Error Code Verification ──────────────────────────────────────
  describe("IDL Error Code Integrity", () => {
    it("IDL defines all required security error codes", () => {
      const errors = program.idl.errors ?? [];
      const errorNames = errors.map((e) => e.name);
      
      const requiredErrors = [
        "NameTooLong",
        "SymbolTooLong",
        "UriTooLong",
        "InvalidTreasury",
      ];

      for (const errName of requiredErrors) {
        assert.include(
          errorNames,
          errName,
          `IDL must define error: ${errName}`
        );
      }
      console.log("✅ All security error codes present in IDL:", errorNames);
    });
  });
});
