import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSwap } from "../hooks/useSwap";
import { Skeleton } from "./Skeleton";
import { useToast } from "./ToastContext";
import { useAppContext } from "./AppContext";

export function SwapCard() {
  const { connected } = useWallet();
  const { initializePool, swap, loading, error } = useSwap();
  const { solBalance } = useAppContext();
  const [solAmount, setSolAmount] = useState<string>("0.1");
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const handleMax = () => {
    if (solBalance) {
      // Leave a tiny bit for fees
      const max = solBalance > 0.01 ? solBalance - 0.01 : 0;
      setSolAmount(max.toFixed(4));
    }
  };

  const vespAmount = Number(solAmount) * 1000;

  if (!connected) {
    return (
      <div className="glass-card highlight-primary" style={{ textAlign: "center", padding: "64px 24px" }}>
        <h3 className="card-title" style={{ justifyContent: "center" }}>Swap Assets</h3>
        <p style={{ color: "var(--text-dim)" }}>Please connect your wallet to use VesperSwap.</p>
      </div>
    );
  }

  return (
    <div className="glass-card highlight-primary">
      <h3 className="card-title">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 12h-14.5m0 0 3-3m-3 3 3 3"/>
        </svg>
        VesperSwap (SOL ➔ VESP)
      </h3>
      
      <div style={{ marginBottom: 24 }}>
        <button 
          className="btn-outline" 
          onClick={initializePool} 
          disabled={loading} 
          style={{ width: '100%', fontSize: '0.8rem', padding: '8px 0', borderRadius: '8px' }}
        >
          ⚙️ Admin: Initialize VESP Pool
        </button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", padding: 20, borderRadius: 16, marginBottom: 8, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Pay</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input 
            type="number" 
            value={solAmount} 
            onChange={(e) => setSolAmount(e.target.value)}
            style={{ width: "100%", background: "transparent", border: "none", color: "#fff", fontSize: "2.5rem", outline: "none", fontWeight: 300 }}
            placeholder="0.0"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: "rgba(0,0,0,0.3)", padding: '8px 16px', borderRadius: 99 }}>
            <span style={{ fontWeight: 600 }}>SOL</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <span>Balance: {solBalance !== null ? solBalance.toFixed(4) : "0"} SOL</span>
          <button onClick={handleMax} style={{ background: "transparent", border: "none", color: "var(--primary-orange)", cursor: "pointer", fontWeight: 600 }}>MAX</button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "-12px 0 8px 0", position: "relative", zIndex: 10 }}>
        <button style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-surface-elevated)", border: "2px solid var(--bg-base)", color: "var(--text-main)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
          ⇅
        </button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", padding: 20, borderRadius: 16, marginBottom: 24 }}>
        <p style={{ color: "var(--text-dim)", marginBottom: 12, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Receive</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 1, fontSize: "2.5rem", fontWeight: 300, color: "var(--text-main)" }}>
            {isNaN(vespAmount) ? "0" : vespAmount}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: "rgba(0,0,0,0.3)", padding: '8px 16px', borderRadius: 99 }}>
            <span style={{ fontWeight: 600 }}>VESP</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24, padding: "0 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>
          <span>Rate</span>
          <span style={{ color: "var(--text-main)" }}>1 SOL = 1000 VESP</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>
          <span>Price Impact</span>
          <span style={{ color: "var(--primary-green)" }}>~0.01%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <span>Slippage Tolerance</span>
          <span style={{ color: "var(--text-main)" }}>0.5%</span>
        </div>
      </div>

      <button 
        className="btn-premium btn-primary" 
        onClick={async () => {
          const tx = await swap(Number(solAmount));
          if (tx) showToast('Swap successful!', 'success', `https://solscan.io/tx/${tx}?cluster=devnet`);
        }} 
        disabled={loading || Number(solAmount) <= 0 || (solBalance ? Number(solAmount) > solBalance : false)} 
      >
        {loading ? <div className="spinner" /> : "SWAP"}
      </button>

    </div>
  );
}
