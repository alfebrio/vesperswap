import { useState } from "react";
import { useNft } from "../hooks/useNft";

export function NftCard() {
  const [name, setName] = useState("My Awesome NFT");
  const [symbol, setSymbol] = useState("MANTRA");
  const [uri, setUri] = useState("https://arweave.net/123");
  
  const { mintNft, loading, error } = useNft();
  const [successMint, setSuccessMint] = useState<string | null>(null);

  const handleMint = async () => {
    setSuccessMint(null);
    const mintAddress = await mintNft(name, symbol, uri);
    if (mintAddress) {
      setSuccessMint(mintAddress);
    }
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 12a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
        </svg>
        NFT Studio
      </h3>

      <div className="input-group">
        <label className="input-label">NFT Name</label>
        <input
          type="text"
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Symbol</label>
        <input
          type="text"
          className="input-field"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </div>
      
      <div className="input-group">
        <label className="input-label">Metadata URI</label>
        <input
          type="text"
          className="input-field"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
      </div>

      <button
        className="btn-premium btn-primary"
        style={{ width: '100%', marginBottom: 16 }}
        onClick={handleMint}
        disabled={loading}
      >
        {loading ? "Minting..." : "Mint Premium NFT"}
      </button>
      
      {successMint && (
        <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.08)', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: 12 }}>
          <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>✓ NFT Minted!</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', wordBreak: 'break-all', marginTop: 4 }}>
            {successMint.slice(0, 8)}...{successMint.slice(-8)}
          </p>
          <a
            href={`https://solscan.io/token/${successMint}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'block', marginTop: 6, fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.8 }}
          >
            ↗ View NFT on Solscan
          </a>
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 12, marginBottom: 12 }}>
          ⚠️ {error.slice(0, 100)}...
        </p>
      )}

      <div style={{ marginTop: 24, padding: '12px 0', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <p>Currently supporting standard Metaplex Master Editions.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, opacity: 0.6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)' }} />
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(45deg, #00b09b, #96c93d)' }} />
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(45deg, #f83600, #f9d423)' }} />
        </div>
      </div>
    </div>
  );
}
