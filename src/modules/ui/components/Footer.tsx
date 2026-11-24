import React from 'react';
import { Building2, ShieldCheck, Lock, PhoneCall, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
  onOpenEstimator: () => void;
  onNavigateTab: (tab: string) => void;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenConsultation,
  onOpenEstimator,
  onNavigateTab,
  isDarkMode
}) => {
  return (
    <footer className={`border-t transition-colors ${
      isDarkMode ? 'bg-[#070707] border-white/10 text-white/70' : 'bg-[#070707] border-white/10 text-white/70'
    }`}>
      {/* Upper CTA Banner */}
      <div className="border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
              Ready to Realize Your Vision?
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#F5F5F0]">
              Initiate Your Private Architectural Consultation
            </h3>
          </div>

          <button
            onClick={onOpenConsultation}
            className="px-7 py-3.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#c4ab7d] transition-all shrink-0"
          >
            Book Consultation
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-[#B59B6D] p-[1px]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-sm flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#B59B6D]" />
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-[#B59B6D]">ApexaLith</span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.25em] text-white/50">Construction & Architecture</span>
            </div>
          </div>

          <p className="text-xs text-white/50 leading-relaxed font-light max-w-sm">
            ApexaLith is an integrated Construction Technology (ConTech) platform combining luxury architecture, structural engineering, turnkey execution, and encrypted VIP client project governance.
          </p>

          <div className="flex items-center space-x-4 pt-2 text-xs text-white/40 font-mono">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-[#B59B6D]" />
              <span>AES-256 Vault</span>
            </span>
            <span>•</span>
            <span>WCAG 2.1 AA</span>
          </div>
        </div>

        {/* Col 2: Core Verticals */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">Business Verticals</h4>
          <ul className="space-y-2 text-xs text-white/50">
            <li><button onClick={() => onNavigateTab('domains')} className="hover:text-[#B59B6D] transition">Luxury Residential</button></li>
            <li><button onClick={() => onNavigateTab('domains')} className="hover:text-[#B59B6D] transition">Commercial Towers</button></li>
            <li><button onClick={() => onNavigateTab('domains')} className="hover:text-[#B59B6D] transition">Architecture & Structural</button></li>
            <li><button onClick={() => onNavigateTab('domains')} className="hover:text-[#B59B6D] transition">Interior Design & Millwork</button></li>
            <li><button onClick={() => onNavigateTab('domains')} className="hover:text-[#B59B6D] transition">Turnkey Solutions</button></li>
          </ul>
        </div>

        {/* Col 3: Platform Portals */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">Platform Portals</h4>
          <ul className="space-y-2 text-xs text-white/50">
            <li><button onClick={() => onNavigateTab('vault')} className="hover:text-[#B59B6D] text-[#B59B6D] font-bold">VIP Client Vault</button></li>
            <li><button onClick={() => onNavigateTab('construction_portal')} className="hover:text-[#B59B6D] transition">Construction Team Workspace</button></li>
            <li><button onClick={() => onNavigateTab('portfolio')} className="hover:text-[#B59B6D] transition">Portfolio Spotlights</button></li>
            <li><button onClick={() => onNavigateTab('domains')} className="hover:text-[#B59B6D] transition">Construction Services</button></li>
            <li><button onClick={() => onNavigateTab('materials')} className="hover:text-[#B59B6D] transition">Materials & Finishes</button></li>
          </ul>
        </div>

        {/* Col 4: Executive Headquarters */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">Headquarters</h4>
          <div className="text-xs text-white/50 space-y-1 font-light">
            <p>ApexaLith Executive Tower</p>
            <p>880 Wilshire Boulevard, Suite 2100</p>
            <p>Beverly Hills, CA 90211</p>
            <p className="pt-2 text-[#B59B6D] font-mono">+1 (800) 555-APEXA</p>
            <p className="font-mono">concierge@apexalith.com</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-white/30 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 ApexaLith. All Rights Reserved. Luxury Construction, Architecture & Interior Excellence.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white/60">Privacy Policy</a>
            <a href="#" className="hover:text-white/60">Terms of Governance</a>
            <a href="#" className="hover:text-white/60">GDPR & CCPA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
