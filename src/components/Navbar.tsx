import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Lock, 
  PhoneCall, 
  UserCheck, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown,
  Layers,
  Briefcase,
  Compass,
  FileText,
  MapPin,
  ArrowRight,
  LogIn,
  HardHat,
  Shield
} from 'lucide-react';
import { UserRole } from '../types';
import { INITIAL_PROJECTS, MOCK_MATERIALS } from '../data/mockData';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenConsultation: () => void;
  onOpenEstimator: () => void;
  onOpenAiAdvisor: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
  activeTab: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenConsultation,
  onOpenEstimator,
  onOpenAiAdvisor,
  onOpenAuth,
  onNavigateTab,
  activeTab,
  isDarkMode,
  onToggleTheme,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const roles: { key: UserRole; label: string; badge: string }[] = [
    { key: 'guest', label: 'Public Visitor', badge: 'Public' },
    { key: 'customer', label: 'Client (VIP Homeowner)', badge: 'VIP Portal' },
    { key: 'project_manager', label: 'Construction Team / PM', badge: 'Site PM' },
    { key: 'admin', label: 'Super Administrator', badge: 'Admin Command' }
  ];

  // Live Search Matching Logic
  const trimmedSearch = (searchQuery || '').trim().toLowerCase();
  const matchingProjects = trimmedSearch
    ? INITIAL_PROJECTS.filter(p => 
        (p.name && p.name.toLowerCase().includes(trimmedSearch)) ||
        (p.location && p.location.toLowerCase().includes(trimmedSearch)) ||
        (p.archetype && p.archetype.toLowerCase().includes(trimmedSearch)) ||
        (p.description && p.description.toLowerCase().includes(trimmedSearch))
      ).slice(0, 4)
    : [];

  const matchingMaterials = trimmedSearch
    ? MOCK_MATERIALS.filter(m =>
        (m.name && m.name.toLowerCase().includes(trimmedSearch)) ||
        (m.category && m.category.toLowerCase().includes(trimmedSearch))
      ).slice(0, 3)
    : [];

  const totalMatches = matchingProjects.length + matchingMaterials.length;

  const handleSelectSearchResult = (targetTab: string) => {
    onNavigateTab(targetTab);
    setSearchFocused(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md border-b ${
      isDarkMode 
        ? 'bg-[#090C12]/95 border-white/10 text-[#F5F5F0]' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Top Banner - Brand Identity & Role Context */}
      <div className={`px-4 py-1.5 text-xs border-b flex justify-between items-center ${
        isDarkMode ? 'bg-[#06080D] border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center space-x-3 overflow-x-auto py-0.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase bg-[#B59B6D]/20 text-[#B59B6D] border border-[#B59B6D]/30">
            ApexaLith Architecture
          </span>
          <span className="hidden sm:inline-block opacity-40">•</span>
          <span className="hidden sm:inline-block tracking-wider uppercase text-[10px] font-medium">
            Luxury Construction, Architecture & Turnkey Services
          </span>
        </div>

        {/* Role & Auth Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-[#B59B6D] text-black hover:bg-[#c4ab7d] transition"
          >
            <LogIn className="w-3 h-3" />
            <span>Portal Login</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-sm text-[11px] uppercase tracking-wider transition border ${
                isDarkMode 
                  ? 'bg-[#141824] border-white/10 hover:border-[#B59B6D] text-white/90' 
                  : 'bg-white border-slate-300 hover:border-[#B59B6D] text-slate-800'
              }`}
            >
              <UserCheck className="w-3 h-3 text-[#B59B6D]" />
              <span>Role: <strong className="capitalize text-[#B59B6D] font-bold">{currentRole.replace('_', ' ')}</strong></span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className={`absolute right-0 mt-1 w-64 rounded-sm shadow-2xl border py-2 z-50 ${
                isDarkMode ? 'bg-[#0D1017] border-white/10 text-white/90' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#B59B6D] uppercase tracking-[0.2em] border-b border-white/10">
                  Switch Active Context
                </div>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      onRoleChange(r.key);
                      setRoleDropdownOpen(false);
                      if (r.key === 'admin') onNavigateTab('admin');
                      else if (r.key === 'project_manager') onNavigateTab('construction_portal');
                      else if (r.key === 'customer') onNavigateTab('vault');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#B59B6D]/10 transition ${
                      currentRole === r.key ? 'text-[#B59B6D] font-bold bg-[#B59B6D]/10' : ''
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-black/20 text-[#B59B6D] font-mono uppercase font-bold border border-[#B59B6D]/30">
                      {r.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigateTab('home')} 
          className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 border border-[#B59B6D] flex items-center justify-center bg-[#06080D] transition group-hover:border-[#B59B6D]">
            <span className="text-[#B59B6D] text-xs font-bold tracking-widest">AL</span>
          </div>
          <div>
            <span className={`text-xl font-serif font-bold tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Apexa<span className="text-[#B59B6D]">Lith</span>
            </span>
            <span className={`block text-[8px] uppercase tracking-[0.3em] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Architectural Group
            </span>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-2 relative">
          <div className={`relative w-full rounded-sm border transition-all ${
            isDarkMode 
              ? 'bg-[#121622] border-white/15 text-white focus-within:border-[#B59B6D]' 
              : 'bg-slate-100 border-slate-300 text-slate-900 focus-within:border-[#B59B6D]'
          }`}>
            <Search className={`absolute left-3 top-2.5 w-3.5 h-3.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search projects, materials, specs..."
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onNavigateTab('portfolio');
                  setSearchFocused(false);
                }
              }}
              className="w-full bg-transparent pl-8 pr-8 py-1.5 text-xs focus:outline-none placeholder:text-slate-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className={`absolute right-2.5 top-2 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Instant Search Dropdown */}
          {searchFocused && trimmedSearch.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-sm border shadow-2xl p-3 z-50 space-y-3 min-w-[340px] max-h-96 overflow-y-auto ${
              isDarkMode ? 'bg-[#0D1017] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#B59B6D] border-b border-white/10 pb-2">
                <span>Search Matches ("{searchQuery}")</span>
                <span className="font-mono">{totalMatches} Found</span>
              </div>

              {matchingProjects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => handleSelectSearchResult('portfolio')}
                  className="p-2 rounded-sm cursor-pointer transition flex items-center space-x-3 border border-white/5 hover:border-[#B59B6D] hover:bg-white/5"
                >
                  <img src={proj.heroImage} alt={proj.name} className="w-12 h-9 object-cover rounded-sm shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{proj.name}</div>
                    <div className="text-[10px] text-slate-400">{proj.location} • {proj.archetype}</div>
                  </div>
                </div>
              ))}

              {totalMatches === 0 && (
                <div className="text-xs text-center py-2 text-slate-400 italic">No matches found.</div>
              )}
            </div>
          )}
        </div>

        {/* Clean Editorial Nav Links (No CAD/BIM or 3D studio tabs) */}
        <nav className={`hidden lg:flex items-center space-x-1 text-xs uppercase tracking-[0.15em] font-bold ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          <button
            onClick={() => onNavigateTab('home')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'home' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            Showcase
          </button>

          <button
            onClick={() => onNavigateTab('portfolio')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'portfolio' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            Portfolio
          </button>

          <button
            onClick={() => onNavigateTab('domains')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'domains' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            Services
          </button>

          <button
            onClick={() => onNavigateTab('materials')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'materials' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            Materials
          </button>

          {/* VIP Client Vault Link */}
          <button
            onClick={() => {
              if (currentRole === 'guest') {
                onRoleChange('customer');
              }
              onNavigateTab('vault');
            }}
            className={`px-3 py-1 rounded-sm transition flex items-center space-x-1.5 border ${
              activeTab === 'vault' ? 'border-[#B59B6D] bg-[#B59B6D] text-black font-bold' : 'border-[#B59B6D]/40 text-[#B59B6D] hover:bg-[#B59B6D] hover:text-black'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>VIP Client Vault</span>
          </button>

          {/* Construction Team Workspace */}
          {(currentRole === 'project_manager' || currentRole === 'admin') && (
            <button
              onClick={() => onNavigateTab('construction_portal')}
              className={`px-3 py-1.5 transition flex items-center space-x-1 ${
                activeTab === 'construction_portal' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5 text-[#B59B6D]" />
              <span>Site PM</span>
            </button>
          )}

          {/* Super Admin Control Centre */}
          {currentRole === 'admin' && (
            <button
              onClick={() => onNavigateTab('admin')}
              className={`px-3 py-1.5 transition flex items-center space-x-1 ${
                activeTab === 'admin' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#B59B6D]" />
              <span>Admin Centre</span>
            </button>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-sm border transition ${
              isDarkMode 
                ? 'border-white/15 text-[#B59B6D] hover:bg-white/10' 
                : 'border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onOpenConsultation}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-[0.18em] transition shadow-md"
          >
            <PhoneCall className="w-3 h-3" />
            <span className="hidden sm:inline">Request Consultation</span>
            <span className="sm:hidden">Consult</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-1.5 rounded-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-5 py-5 space-y-3 ${
          isDarkMode ? 'bg-[#090C12] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <button
            onClick={() => { onNavigateTab('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10"
          >
            Public Showcase
          </button>
          <button
            onClick={() => { onNavigateTab('portfolio'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10"
          >
            Portfolio Spotlights
          </button>
          <button
            onClick={() => { onNavigateTab('domains'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10"
          >
            Construction Services
          </button>
          <button
            onClick={() => { onNavigateTab('materials'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10"
          >
            Materials & Finishes
          </button>
          <button
            onClick={() => { 
              if (currentRole === 'guest') onRoleChange('customer');
              onNavigateTab('vault'); 
              setMobileMenuOpen(false); 
            }}
            className="w-full text-left py-2 text-xs uppercase tracking-wider font-bold text-[#B59B6D] border-b border-white/10"
          >
            VIP Client Portal
          </button>
          <button
            onClick={() => { onNavigateTab('construction_portal'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-xs uppercase tracking-wider font-bold text-white border-b border-white/10"
          >
            Construction Team Workspace
          </button>
          <button
            onClick={() => { onNavigateTab('admin'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-xs uppercase tracking-wider font-bold text-[#B59B6D]"
          >
            Admin Command Centre
          </button>
        </div>
      )}
    </header>
  );
};
