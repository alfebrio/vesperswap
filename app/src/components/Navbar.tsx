import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: 'swap', label: 'Swap' },
    { id: 'token', label: 'Token Factory' },
    { id: 'nft', label: 'NFT Studio' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-jet/40 backdrop-blur-xl border-b border-silver/10 h-16 flex justify-between items-center px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-coral" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
        <span className="text-white font-bold text-lg tracking-wide">VesperSwap</span>
      </div>

      {/* Center: Tabs */}
      <div className="flex items-center gap-8 h-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative h-full px-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id ? 'text-white' : 'text-silver hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-coral shadow-[0_-2px_10px_rgba(239,131,84,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Right: Wallet */}
      <div className="flex items-center gap-4">
        <button className="border border-coral text-coral rounded-full px-4 py-1.5 text-sm font-medium hover:bg-coral hover:text-white transition-all duration-200 hover:shadow-[0_0_16px_rgba(239,131,84,0.4)] active:scale-[0.98]">
          Connect Wallet
        </button>
        <button className="text-silver hover:text-white transition-colors">
          <MoreHorizontal size={24} />
        </button>
      </div>
    </nav>
  );
}
