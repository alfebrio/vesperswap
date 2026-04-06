import { useState, useEffect } from "react";
import { useNft } from "../hooks/useNft";
import { Skeleton } from "./Skeleton";
import { useToast } from "./ToastContext";

export function NftCard() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [uri, setUri] = useState("");
  
  const { mintNft, loading, error } = useNft();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const handleMint = async () => {
    if (!name || !uri) {
      showToast("Name and URI are required", "error");
      return;
    }
    const mintAddress = await mintNft(name, symbol, uri);
    if (mintAddress) {
      showToast('NFT Minted Successfully!', 'success', `https://solscan.io/token/${mintAddress}?cluster=devnet`);
    }
  };

  // Simple heuristic checking if URI ends with an image extension
  const isImageUri = uri.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) != null;

  return (
    <div className="glass-card highlight-primary">
      <h3 className="card-title">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 12a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
        </svg>
        NFT Studio
      </h3>

      <div className="form-preview-grid">
        {/* Left Side: Form */}
        <div>
          <div className="input-group">
            <label className="input-label">NFT Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Master Edition #1"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Symbol</label>
            <input
              type="text"
              className="input-field"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. MS1"
            />
          </div>
          
          <div className="input-group" style={{ marginBottom: 32 }}>
            <label className="input-label">Metadata URI (Link)</label>
            <input
              type="text"
              className="input-field"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="https://arweave.net/..."
            />
          </div>

          <button
            className="btn-premium btn-primary"
            style={{ width: '100%', marginBottom: 16 }}
            onClick={handleMint}
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : "Mint Premium NFT"}
          </button>
          
          <div style={{ marginTop: 24, padding: '16px', background: "rgba(167, 139, 250, 0.05)", borderRadius: 12, border: '1px solid rgba(167, 139, 250, 0.2)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <p style={{ color: "var(--text-main)", fontWeight: 500, marginBottom: 4 }}>Powered by Metaplex Core</p>
            <p>Creating a Master Edition NFT currently requires a protocol fee of 0.05 SOL by the smart contract.</p>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          <div style={{ width: "100%", maxWidth: 320, background: "var(--bg-input)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            
            <div style={{ width: "100%", aspectRatio: "1/1", background: "var(--bg-surface-elevated)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {(isImageUri || uri.includes("https://")) && uri.length > 10 ? (
                // Assume it's a valid image URL for preview if user types an absolute URL
                <img src={uri} alt="NFT Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div style="color:var(--text-muted);font-size:0.8rem">Image failed to load</div>' }} />
              ) : (
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: 20 }}>
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ margin: "0 auto 12px", opacity: 0.5 }}>
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.75 12c0-5.109 4.141-9.25 9.25-9.25s9.25 4.141 9.25 9.25-4.141 9.25-9.25 9.25-9.25-4.141-9.25-9.25Z" />
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.75 10.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17.25 10.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.25 15.25a3.5 3.5 0 0 1-6.5 0" />
                  </svg>
                  Metadata Image Preview
                </div>
              )}
              
              {/* Badge placeholder */}
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: 99, fontSize: "0.7rem", fontWeight: 600, color: "#fff" }}>
                Master Edition
              </div>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, marginBottom: 4, letterSpacing: "1px" }}>
                {symbol || "SYMBOL"}
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-main)", marginBottom: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {name || "Unnamed NFT"}
              </h4>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                <div>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 2 }}>Current Price</p>
                  <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>-- SOL</p>
                </div>
                <button style={{ background: "var(--bg-surface-elevated)", border: "none", color: "var(--text-main)", padding: "6px 12px", borderRadius: 8, fontSize: "0.8rem", fontWeight: 600 }}>
                  Detail
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
