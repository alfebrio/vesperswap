import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCounter } from "../hooks/useCounter";

export function CounterCard() {
  const { connected } = useWallet();
  const { state, initialize, increment, decrement } = useCounter();
  const { count, initialized, loading, txLoading, error, lastTx, counterPda } = state;

  const [bumping, setBumping] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count !== prevCount.current) {
      setBumping(true);
      prevCount.current = count;
      const t = setTimeout(() => setBumping(false), 250);
      return () => clearTimeout(t);
    }
  }, [count]);

  const isLoading = loading || txLoading !== null;

  if (!connected) {
    return (
      <div className="glass-card">
        <h3 className="card-title">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.75 12a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0Z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.25 12c0 4.004-3.246 7.25-7.25 7.25S4.75 16.004 4.75 12 7.996 4.75 12 4.75s7.25 3.246 7.25 7.25Z" />
          </svg>
          Counter Engine
        </h3>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--text-dim)', marginBottom: 20 }}>Connect wallet to interact with on-chain counter.</p>
        </div>
      </div>
    );
  }

  if (!initialized && !loading) {
    return (
      <div className="glass-card">
        <h3 className="card-title">Counter Engine</h3>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>No counter found for this wallet. Initialize to start!</p>
          <button
            className="btn-premium btn-primary"
            style={{ width: '100%' }}
            onClick={initialize}
            disabled={!!txLoading}
          >
            {txLoading === "initialize" ? "Initializing..." : "Initialize Counter"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 className="card-title">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.75 8.75a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H6.75a2 2 0 0 1-2-2V8.75Z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.75 4.75v4M15.25 4.75v4" />
        </svg>
        Counter Engine
      </h3>

      <div className="counter-hero">
        <div className={`counter-val ${bumping ? "animate-pulse" : ""}`}>
          {count}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Value</p>
      </div>

      <div className="button-rows" style={{ marginBottom: 24 }}>
        <button
          className="btn-premium btn-outline"
          onClick={decrement}
          disabled={isLoading}
        >
          {txLoading === "decrement" ? "Wait..." : "Decrement"}
        </button>
        <button
          className="btn-premium btn-secondary"
          onClick={increment}
          disabled={isLoading}
        >
          {txLoading === "increment" ? "Wait..." : "Increment"}
        </button>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Status</span>
          <span style={{ color: 'var(--secondary)' }}>Live on Devnet</span>
        </div>
        {counterPda && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Address</span>
            <span style={{ fontSize: '0.7rem' }}>{counterPda.toBase58().slice(0, 4)}...{counterPda.toBase58().slice(-4)}</span>
          </div>
        )}
      </div>

      {error && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 16 }}>⚠️ {error}</div>}

      {lastTx && (
        <a
          href={`https://solscan.io/tx/${lastTx}?cluster=devnet`}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block', marginTop: 12, fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.8 }}
        >
          ↗ View Last Tx on Solscan
        </a>
      )}
    </div>
  );
}
