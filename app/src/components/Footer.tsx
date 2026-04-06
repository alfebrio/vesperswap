import React from 'react';

export function Footer() {
  return (
    <footer className="bg-jet border-t border-silver/10 pt-12 pb-8 px-8 relative z-10 text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Col 1 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-coral" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              <span className="text-white font-bold text-lg">VesperSwap</span>
            </div>
            <p className="text-silver text-sm mt-2">Trade, create, and launch on-chain.</p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-silver">
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Swap Tokens</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Token Factory</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">NFT Studio</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Docs</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Blog</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-silver">
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Help Center</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Request Feature</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">FAQs</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Getting Started</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-silver">
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Terms of Service</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-silver">
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Twitter / X</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Discord</a></li>
              <li><a href="#" className="hover:text-coral transition-colors duration-150">Telegram</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-silver/10 mt-12 pt-6 text-center text-silver/40 text-xs">
          © 2026 VesperSwap. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
