import { useState, useEffect } from "react";
import { useToken } from "../hooks/useToken";
import { Skeleton } from "./Skeleton";
import { useToast } from "./ToastContext";

export function TokenCard() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(6);
  const [mintAmount, setMintAmount] = useState(1000);
  
  const [burnMintAddress, setBurnMintAddress] = useState("");
  const [burnAmount, setBurnAmount] = useState(50);
  
  const { mintTokens, burnTokens, loading, error } = useToken();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const handleMint = async () => {
    // We only pass mintAmount to the backend, name/symbol/decimals are visual here
    const mintAddress = await mintTokens(mintAmount);
    if (mintAddress) {
      showToast('Successfully Minted Token!', 'success', `https://solscan.io/token/${mintAddress.toBase58()}?cluster=devnet`);
      setBurnMintAddress(mintAddress.toBase58());
    }
  };

  const handleBurn = async () => {
    if (!burnMintAddress) return;
    const signature = await burnTokens(burnMintAddress, burnAmount);
    if (signature) {
      showToast('Successfully Burned!', 'success', `https://solscan.io/tx/${signature}?cluster=devnet`);
    }
  };

  return (
    <div className="glass-card highlight-primary">
      <h3 className="card-title">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 8.75h-3a1.5 1.5 0 0 0 0 3h1.5a1.5 1.5 0 0 1 0 3h-3M12 7.75v1M12 15.25v1" />
        </svg>
        Token Factory
      </h3>

      <div className="form-preview-grid">
        
        {/* Left Side: Forms */}
        <div>
          <div style={{ marginBottom: 32 }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 16, color: 'var(--text-dim)' }}>Mint New SPL Token</h4>
            
            <div className="input-group">
              <label className="input-label">Token Name</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vesper Coin"
              />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Symbol</label>
                <input
                  type="text"
                  className="input-field"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. VESP"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Decimals</label>
                <input
                  type="number"
                  className="input-field"
                  value={decimals}
                  onChange={(e) => setDecimals(Number(e.target.value))}
                  placeholder="6"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Supply Amount</label>
              <input
                type="number"
                className="input-field"
                value={mintAmount}
                onChange={(e) => setMintAmount(Number(e.target.value))}
                placeholder="1000"
              />
            </div>

            <button
              className="btn-premium btn-primary"
              onClick={handleMint}
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? <div className="spinner" /> : "Create Token"}
            </button>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32 }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 16, color: 'var(--text-dim)' }}>Burn Tokens</h4>
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
              <label className="input-label">Amount to Burn</label>
              <input
                type="number"
                className="input-field"
                value={burnAmount}
                onChange={(e) => setBurnAmount(Number(e.target.value))}
                placeholder="Amount"
              />
            </div>

            <button
              className="btn-premium"
              style={{ width: '100%', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', border: '1px solid rgba(244, 63, 94, 0.2)', marginTop: 8 }}
              onClick={handleBurn}
              disabled={loading || !burnMintAddress}
            >
              {loading ? <div className="spinner" style={{ borderColor: 'rgba(244, 63, 94, 0.3)', borderTopColor: 'var(--danger)' }} /> : "Burn Tokens"}
            </button>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div style={{ background: "var(--bg-input)", borderRadius: "var(--radius-md)", padding: "32px 24px", border: "1px dashed var(--border)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", marginBottom: 32 }}>Live Preview</p>
          
          <div style={{ width: 120, height: 120, borderRadius: 24, background: "linear-gradient(135deg, var(--primary), var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "#fff", marginBottom: 24, boxShadow: "0 10px 30px rgba(249, 115, 22, 0.2)" }}>
            {symbol ? symbol.substring(0, 1).toUpperCase() : "$"}
          </div>
          
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "var(--text-main)", textAlign: "center" }}>
            {name || "Token Name"}
          </h2>
          <p style={{ color: "var(--primary)", fontSize: "1rem", fontWeight: 600, marginTop: 4 }}>
            {symbol ? `$${symbol.toUpperCase()}` : "SYMBOL"}
          </p>
          
          <div style={{ width: "100%", marginTop: "auto", paddingTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 12, fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Total Supply</span>
              <span style={{ fontWeight: 600 }}>{mintAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Decimals</span>
              <span style={{ fontWeight: 600 }}>{decimals}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
