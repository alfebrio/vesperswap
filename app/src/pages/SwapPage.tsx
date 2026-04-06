import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowUpDown, ArrowRight } from 'lucide-react';

export function SwapPage() {
  const [fromAmount, setFromAmount] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);
  const [activeSlippage, setActiveSlippage] = useState('0.5%');

  const handleSwapDirection = () => {
    setIsSwapped(!isSwapped);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="max-w-md mx-auto pt-28 pb-16 w-full relative z-10"
    >
      <div className="bg-slate/25 backdrop-blur-md border border-silver/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-xl mb-6">Swap Tokens</h2>

        {/* FROM Section */}
        <div className="bg-jet border border-silver/20 rounded-xl p-4 mb-2 focus-within:border-coral focus-within:ring-1 focus-within:ring-coral/50 transition-all">
          <label className="text-silver text-sm font-medium mb-1 block">From</label>
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 bg-jet/60 rounded-xl px-3 py-2 hover:bg-slate/40 transition-colors">
              <div className="w-6 h-6 rounded-full bg-slate flex-shrink-0" />
              <span className="text-white font-medium">{isSwapped ? 'USDC' : 'SOL'}</span>
              <ChevronDown size={16} className="text-silver" />
            </button>
            <input 
              type="text" 
              placeholder="0.00" 
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent border-none text-right text-white text-2xl w-full focus:outline-none placeholder-silver/40"
            />
          </div>
          <p className="text-silver text-xs mt-2 text-right">Balance: {isSwapped ? '1,450.00' : '2.45'} {isSwapped ? 'USDC' : 'SOL'}</p>
        </div>

        {/* Swap Arrow Button */}
        <div className="relative h-4 flex items-center justify-center my-2 cursor-pointer z-10">
          <div className="absolute inset-x-0 h-[1px] bg-silver/10" />
          <motion.button 
            onClick={handleSwapDirection}
            className="bg-jet border border-silver/20 rounded-full p-2 text-silver hover:border-coral hover:text-coral transition-colors z-10"
            animate={{ rotate: isSwapped ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpDown size={18} />
          </motion.button>
        </div>

        {/* TO Section */}
        <div className="bg-jet border border-silver/20 rounded-xl p-4 mt-2">
          <label className="text-silver text-sm font-medium mb-1 block">To (Estimated)</label>
          <div className="flex items-center justify-between">
             <button className="flex items-center gap-2 bg-jet/60 rounded-xl px-3 py-2 hover:bg-slate/40 transition-colors">
              <div className="w-6 h-6 rounded-full bg-coral/80 flex-shrink-0" />
              <span className="text-white font-medium">{isSwapped ? 'SOL' : 'USDC'}</span>
              <ChevronDown size={16} className="text-silver" />
            </button>
            <input 
              type="text" 
              placeholder="0.00" 
              value={fromAmount ? (parseFloat(fromAmount) * 145.2).toFixed(2) : ''}
              readOnly
              className="bg-transparent border-none text-right text-coral text-2xl w-full focus:outline-none placeholder-silver/40"
            />
          </div>
          <p className="text-silver text-xs mt-2 text-right">Balance: {isSwapped ? '2.45' : '1,450.00'} {isSwapped ? 'SOL' : 'USDC'}</p>
        </div>

        {/* Slippage Row */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-silver text-xs">Slippage Tolerance</span>
          <div className="flex gap-2">
            {['0.1%', '0.5%', '1.0%'].map(val => (
              <button 
                key={val}
                onClick={() => setActiveSlippage(val)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeSlippage === val 
                    ? 'bg-coral text-white border-coral' 
                    : 'bg-jet text-silver border-silver/20 hover:border-silver/40'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Swap Button */}
        <button className="w-full bg-coral text-white font-semibold rounded-full py-3 mt-4 hover:bg-coral/90 hover:shadow-[0_0_24px_rgba(239,131,84,0.5)] transition-all duration-200 active:scale-[0.98]">
          Swap
        </button>
      </div>

      {/* Route Info */}
      <div className="text-silver text-xs text-center mt-3 flex items-center justify-center gap-1">
        <span>Route: {isSwapped ? 'USDC' : 'SOL'}</span>
        <ArrowRight size={12} className="text-silver/50" />
        <span>Vesper Pool</span>
        <ArrowRight size={12} className="text-silver/50" />
        <span>{isSwapped ? 'SOL' : 'USDC'}</span>
      </div>
    </motion.div>
  );
}
