import { useCallback, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import idl from "../../../target/idl/vesperswap.json";

const PROGRAM_ID = new PublicKey("96xYKxDbPLnbE1mZmUXJvksn74QUEx7Evh6WmNt9VeM1");
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export function useSwap() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProgram = useCallback(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    return new Program(idl as any, provider);
  }, [connection, wallet]);

  const initializePool = useCallback(async () => {
    const program = getProgram();
    if (!wallet || !program) return;
    setLoading(true);
    setError(null);
    try {
      const [poolAuthority] = PublicKey.findProgramAddressSync([Buffer.from("pool_authority")], PROGRAM_ID);
      const [vespMint] = PublicKey.findProgramAddressSync([Buffer.from("vesp_mint")], PROGRAM_ID);
      const [metadata] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), vespMint.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID
      );

      const tx = await program.methods.initializePool().accounts({
        signer: wallet.publicKey,
        poolAuthority,
        vespMint,
        metadata,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      }).rpc();

      console.log("Pool Init Tx:", tx);
      setLoading(false);
      return tx;
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Gagal inisialisasi pool");
      setLoading(false);
      return null;
    }
  }, [getProgram, wallet]);

  const swap = useCallback(async (solAmount: number) => {
    const program = getProgram();
    if (!wallet || !program) return;
    setLoading(true);
    setError(null);
    try {
      const [poolAuthority] = PublicKey.findProgramAddressSync([Buffer.from("pool_authority")], PROGRAM_ID);
      const [vespMint] = PublicKey.findProgramAddressSync([Buffer.from("vesp_mint")], PROGRAM_ID);
      const userAta = getAssociatedTokenAddressSync(vespMint, wallet.publicKey);
      const TREASURY_ADDRESS = wallet.publicKey; // Pindah SOL ke dompet sendiri untuk demo

      // Amount in lamports (9 decimals)
      const lamports = new BN(solAmount * 10 ** 9);

      const tx = await program.methods.swap(lamports).accounts({
        user: wallet.publicKey,
        treasury: TREASURY_ADDRESS,
        poolAuthority,
        vespMint,
        userAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }).rpc();

      console.log("Swap Tx:", tx);
      setLoading(false);
      return tx;
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Gagal swap");
      setLoading(false);
      return null;
    }
  }, [getProgram, wallet]);

  return { initializePool, swap, loading, error };
}
