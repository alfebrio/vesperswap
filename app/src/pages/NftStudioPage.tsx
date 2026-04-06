import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, X, PlusCircle } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import * as Select from '@radix-ui/react-select';
// Using simulated selects/inputs if the radix wrapper isn't fully set up

export function NftStudioPage() {
  const [royalty, setRoyalty] = useState(5.0);
  const [traits, setTraits] = useState([{ type: 'Background', value: 'Jet Black' }]);

  const addTrait = () => setTraits([...traits, { type: '', value: '' }]);
  const removeTrait = (idx: number) => setTraits(traits.filter((_, i) => i !== idx));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="max-w-5xl mx-auto pt-28 pb-16 w-full relative z-10 px-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN — Config Card */}
        <div className="bg-slate/25 backdrop-blur-md border border-silver/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-xl mb-6">Mint NFT</h2>

          <div className="space-y-4">
            {/* Artwork Upload */}
            <div>
              <div className="h-48 border border-dashed border-coral/40 rounded-xl flex flex-col items-center justify-center text-center hover:border-coral hover:bg-coral/5 transition-all cursor-pointer">
                <ImagePlus size={40} className="text-coral mb-3" />
                <span className="text-silver">Drop artwork here</span>
                <span className="text-silver/50 text-xs mt-1">JPG, PNG, GIF, MP4 — max 50MB</span>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="text-silver text-sm font-medium mb-1 block">NFT Name</label>
              <input type="text" placeholder="e.g. Vesper #001" className="w-full bg-jet border border-silver/20 text-white rounded-xl px-4 py-3 focus:border-coral focus:ring-1 focus:ring-coral/50 focus:outline-none transition-all placeholder:text-silver/40" />
            </div>

            <div>
              <label className="text-silver text-sm font-medium mb-1 block">Description</label>
              <textarea rows={3} placeholder="Describe your NFT story..." className="w-full bg-jet border border-silver/20 text-white rounded-xl px-4 py-3 focus:border-coral focus:ring-1 focus:ring-coral/50 focus:outline-none transition-all placeholder:text-silver/40 resize-none" />
            </div>

            {/* Collection Dropdown */}
            <div>
              <label className="text-silver text-sm font-medium mb-1 block">Collection</label>
               <select className="w-full bg-jet border border-silver/20 text-white rounded-xl px-4 py-3 focus:border-coral focus:ring-1 focus:ring-coral/50 focus:outline-none transition-all appearance-none cursor-pointer">
                 <option>Vesper Founder's Mint</option>
                 <option>Create New Collection +</option>
               </select>
            </div>

            {/* Royalty Slider */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                 <label className="text-silver text-sm font-medium">Royalty Fee</label>
                 <span className="text-coral font-bold text-sm">{royalty.toFixed(1)}%</span>
              </div>
              <Slider.Root 
                className="relative flex items-center select-none touch-none w-full h-[20px]" 
                defaultValue={[5]} 
                max={20} 
                step={0.5} 
                onValueChange={(val: number[]) => setRoyalty(val[0])}
              >
                <Slider.Track className="bg-slate relative grow rounded-full h-[6px]">
                  <Slider.Range className="absolute bg-coral rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-[16px] h-[16px] bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-white focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8" />
              </Slider.Root>
            </div>

            {/* Traits */}
            <div className="pt-2">
              <label className="text-silver text-sm font-medium mb-2 block">Traits</label>
              <div className="space-y-2">
                {traits.map((trait, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                     <input type="text" placeholder="Type (e.g. Skin)" defaultValue={trait.type} className="w-1/2 bg-jet border border-silver/20 text-white rounded-lg px-3 py-2 text-sm focus:border-coral focus:outline-none" />
                     <input type="text" placeholder="Value (e.g. Gold)" defaultValue={trait.value} className="w-1/2 bg-jet border border-silver/20 text-white rounded-lg px-3 py-2 text-sm focus:border-coral focus:outline-none" />
                     <button onClick={() => removeTrait(idx)} className="p-2 text-silver/60 hover:text-red-400 transition-colors">
                        <X size={16} />
                     </button>
                  </div>
                ))}
              </div>
              <div 
                className="text-coral text-sm hover:underline cursor-pointer flex items-center gap-1 mt-3 w-fit"
                onClick={addTrait}
              >
                <PlusCircle size={14} /> Add Trait
              </div>
            </div>

            {/* Mint Button */}
            <button className="w-full bg-coral text-white font-semibold rounded-full py-3 mt-4 hover:bg-coral/90 hover:shadow-[0_0_24px_rgba(239,131,84,0.5)] transition-all duration-200 active:scale-[0.98]">
               Mint NFT ✦
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — Live Preview Card */}
        <div className="sticky top-28">
           <h3 className="text-silver text-sm font-medium mb-3">Live Preview</h3>
           
           {/* Inner Card */}
           <div className="bg-jet rounded-2xl overflow-hidden border border-coral/30 shadow-[0_0_32px_rgba(239,131,84,0.15)] max-w-[340px] mx-auto lg:max-w-none">
              
              {/* Image Area */}
              <div className="aspect-square bg-slate/30 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-jet to-slate/40" />
                 <ImagePlus size={48} className="text-silver/20 z-10" />
              </div>

              {/* Info Section */}
              <div className="p-5">
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-bold text-lg leading-none">Vesper #001</h4>
                 </div>
                 <div className="text-silver text-xs mb-3">Vesper Founder's Mint</div>
                 
                 <div className="text-coral text-xs mb-3 font-medium">Royalty: {royalty.toFixed(1)}%</div>

                 {/* Traits Chips */}
                 <div className="flex flex-wrap gap-1 mt-2">
                    {traits.map((t, i) => t.type && t.value && (
                       <div key={i} className="bg-slate/40 text-silver text-[11px] rounded-sm px-2 py-1 border border-silver/10 uppercase tracking-widest whitespace-nowrap">
                          <span className="opacity-50 mr-1">{t.type}:</span>
                          <span className="text-white font-medium">{t.value}</span>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>

      </div>
    </motion.div>
  );
}
