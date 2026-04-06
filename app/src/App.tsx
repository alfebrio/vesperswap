import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FluidBackground } from "./components/FluidBackground";

import { SwapPage } from "./pages/SwapPage";
import { TokenFactoryPage } from "./pages/TokenFactoryPage";
import { NftStudioPage } from "./pages/NftStudioPage";

// Wallet providers included as requested (mock context or real if wired in main)
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  const [activeTab, setActiveTab] = useState("swap");

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {/* WebGL Fluid Background - Fixed, z:0 */}
          <FluidBackground />

          <div className="min-h-screen flex flex-col relative z-10 selection:bg-coral/30">
            {/* Top Navbar */}
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-grow pt-16 flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === "swap" && <SwapPage key="swap" />}
                {activeTab === "token" && <TokenFactoryPage key="token" />}
                {activeTab === "nft" && <NftStudioPage key="nft" />}
              </AnimatePresence>
            </main>

            {/* Matcha-style Footer */}
            <Footer />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
