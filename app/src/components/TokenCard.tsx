import { useState } from "react";
import { useToken } from "../hooks/useToken";

export function TokenCard() {
  const [mintAmount, setMintAmount] = useState(100);
  const [burnAmount, setBurnAmount] = useState(50);
  const [burnMintAddress, setBurnMintAddress] = useState("");
  
  const { mintTokens, burnTokens, loading, error } = useToken();
  const [successMint, setSuccessMint] = useState<string | null>(null);
  const [successBurn, setSuccessBurn] = useState<string | null>(null);

  const handleMint = async () => {
    setSuccessMint(null);
    setSuccessBurn(null);
    const mintAddress = await mintTokens(mintAmount);
    if (mintAddress) {
      setSuccessMint(mintAddress.toBase58());
      // Auto-fill burn inputs to make testing easier
      setBurnMintAddress(mintAddress.toBase58());
    }
  };

  const handleBurn = async () => {
    if (!burnMintAddress) return;
    setSuccessMint(null);
    setSuccessBurn(null);
    const signature = await burnTokens(burnMintAddress, burnAmount);
    if (signature) {
      setSuccessBurn(signature);
    }
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 8.75h-3a1.5 1.5 0 0 0 0 3h1.5a1.5 1.5 0 0 1 0 3h-3M12 7.75v1M12 15.25v1" />
        </svg>
        Token Factory
      </h3>

      <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--text-dim)' }}>Mint Tokens</h4>
        <div className="input-group">
          <label className="input-label">Amount</label>
          <input
            type="number"
            className="input-field"
            value={mintAmount}
            onChange={(e) => setMintAmount(Number(e.target.value))}
            placeholder="Enter amount"
          />
        </div>

        <button
          className="btn-premium btn-secondary"
          style={{ width: '100%' }}
          onClick={handleMint}
          disabled={loading}
        >
          {loading ? "Processing..." : "Mint New Tokens"}
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--text-dim)' }}>Burn Tokens</h4>
        <div className="input-group">
          <label className="input-label">Mint Address</label>
          <input
            type="text"
            className="input-field"
            value={burnMintAddress}
            onChange={(e) => setBurnMintAddress(e.target.value)}
            placeholder="Paste mint address"
          />
        </div>
        <div className="input-group">
          <label className="input-label">Amount</label>
          <input
            type="number"
            className="input-field"
            value={burnAmount}
            onChange={(e) => setBurnAmount(Number(e.target.value))}
            placeholder="Enter amount to burn"
          />
        </div>

        <button
          className="btn-premium"
          style={{ width: '100%', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', border: '1px solid rgba(244, 63, 94, 0.2)' }}
          onClick={handleBurn}
          disabled={loading || !burnMintAddress}
        >
          {loading ? "Processing..." : "Burn Tokens"}
        </button>
      </div>

      {successMint && (
        <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.08)', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>✓ Successfully Minted!</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', wordBreak: 'break-all', marginTop: 4 }}>
            Mint: {successMint.slice(0, 8)}...{successMint.slice(-8)}
          </p>
        </div>
      )}

      {successBurn && (
        <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.08)', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.2)', marginTop: 8 }}>
          <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>✓ Successfully Burned!</p>
          <a
            href={`https://solscan.io/tx/${successBurn}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'block', marginTop: 4, fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.8 }}
          >
            ↗ View Tx on Solscan
          </a>
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 12 }}>
          ⚠️ {error.slice(0, 100)}...
        </p>
      )}

    </div>
  );
}
