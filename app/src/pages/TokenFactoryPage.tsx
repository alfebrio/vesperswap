import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Rocket, Copy } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import * as Select from '@radix-ui/react-select';
// Note: You may want to construct a native Select if you don't have all radix deps, 
// for simplicity here we simulate it or use standard HTML select styled.

export function TokenFactoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="max-w-lg mx-auto pt-28 pb-16 w-full relative z-10 px-4"
    >
      <div className="bg-slate/25 backdrop-blur-md border border-silver/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-xl mb-6">Create Token</h2>

        <div className="space-y-4">
          {/* Token Name */}
          <div>
            <label className="text-silver text-sm font-medium mb-1 block">Token Name</label>
            <input type="text" placeholder="e.g. Vesper Token" className="w-full bg-jet border border-silver/20 text-white rounded-xl px-4 py-3 focus:border-coral focus:ring-1 focus:ring-coral/50 focus:outline-none transition-all placeholder:text-silver/40" />
          </div>

          {/* Grid: Symbol & Total Supply */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-silver text-sm font-medium mb-1 block">Token Symbol</label>
              <input type="text" placeholder="VESP" className="w-full bg-jet border border-silver/20 text-white rounded-xl px-4 py-3 focus:border-coral focus:ring-1 focus:ring-coral/50 focus:outline-none transition-all uppercase placeholder:text-silver/40" />
            </div>
            <div>
              <label className="text-silver text-sm font-medium mb-1 block">Total Supply</label>
              <input type="number" placeholder="1000000" className="w-full bg-jet border border-silver/20 text-white rounded-xl px-4 py-3 focus:border-coral focus:ring-1 focus:ring-coral/50 focus:outline-none transition-all placeholder:text-silver/40" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-silver text-sm font-medium mb-1 block">Description</label>
            <textarea rows={3} placeholder="Describe your token's utility..." className="w-full bg-jet border border-silver/20 text-white rounded-xl px-4 py-3 focus:border-coral focus:ring-1 focus:ring-coral/50 focus:outline-none transition-all placeholder:text-silver/40 resize-none" />
          </div>

          {/* Logo Upload Zone */}
          <div>
             <label className="text-silver text-sm font-medium mb-1 block">Token Logo</label>
             <div className="border border-dashed border-coral/40 rounded-xl p-8 text-center hover:border-coral hover:bg-coral/5 transition-all cursor-pointer flex flex-col items-center justify-center">
                <Upload className="text-coral mb-2" size={32} />
                <span className="text-silver text-sm">Drop your token logo here</span>
                <span className="text-silver/50 text-xs mt-1">PNG, SVG, or GIF — max 1MB</span>
             </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-4 pt-2">
            {[
              { id: 'mintable', title: 'Mintable', desc: 'Allow owner to mint more tokens later.' },
              { id: 'burnable', title: 'Burnable', desc: 'Holders can burn their tokens to reduce supply.' },
              { id: 'pausable', title: 'Pausable', desc: 'Admin can pause all transfers in emergency.' }
            ].map(item => (
              <div key={item.id} className="flex justify-between items-center bg-jet/50 p-3 rounded-xl border border-silver/10">
                <div>
                  <div className="text-white text-sm font-medium">{item.title}</div>
                  <div className="text-silver text-xs">{item.desc}</div>
                </div>
                <Switch.Root className="w-[42px] h-[25px] bg-silver/20 rounded-full relative shadow-[0_2px_10px] shadow-blackA4 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-coral outline-none cursor-pointer">
                  <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                </Switch.Root>
              </div>
            ))}
          </div>

          <button className="w-full bg-coral text-white font-semibold rounded-full py-3 mt-6 hover:bg-coral/90 hover:shadow-[0_0_24px_rgba(239,131,84,0.5)] transition-all duration-200 active:scale-[0.98] flex justify-center items-center gap-2">
            Deploy Token <Rocket size={18} />
          </button>
        </div>
      </div>

      {/* Recently Created */}
      <div className="mt-8">
        <h3 className="text-silver text-sm mb-3 px-2">Recently Created Tokens</h3>
        <div className="space-y-2">
          {[
            { name: "Pepe AI", sym: "PEPE", address: "0x1a2b...9f0e" },
            { name: "GameFi Beta", sym: "GFB", address: "0x7c4d...3e1a" },
            { name: "Liquid Staking", sym: "LSO", address: "0x9b8c...2d4f" },
          ].map((token, i) => (
             <div key={i} className="flex items-center justify-between bg-slate/20 backdrop-blur-sm border border-silver/10 rounded-xl p-3 hover:border-silver/30 transition-colors cursor-default">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate border border-silver/20" />
                 <div>
                   <div className="text-white text-sm font-medium leading-tight">{token.name}</div>
                   <div className="text-silver text-xs">{token.sym}</div>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-silver/60 text-xs font-mono">{token.address}</span>
                 <Copy size={14} className="text-silver/40 hover:text-coral cursor-pointer transition-colors" />
               </div>
             </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
