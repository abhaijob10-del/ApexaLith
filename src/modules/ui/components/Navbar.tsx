import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Lock, 
  PhoneCall, 
  Sparkles, 
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
  LogIn
} from 'lucide-react';
import { UserRole } from '../../../types';
import { INITIAL_PROJECTS, MOCK_MATERIALS } from '../../../data/mockData';

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
    { key: 'guest', label: 'Public Visitor / Guest', badge: 'Public' },
    { key: 'homeowner', label: 'VIP Homeowner', badge: 'VIP Vault' },
    { key: 'investor', label: 'Real Estate Developer', badge: 'Financials' },
    { key: 'architect', label: 'Architect / Engineer', badge: 'Specs & CAD' },
    { key: 'broker', label: 'Broker Partner', badge: 'Referrals' },
    { key: 'concierge', label: 'Concierge Staff', badge: 'Operations' },
    { key: 'admin', label: 'Super Administrator', badge: 'Full Command' }
  ];

  // Instant Live Search Results Logic
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

  const handleSelectSearchResult = (type: 'project' | 'material', targetTab: string) => {
    onNavigateTab(targetTab);
    setSearchFocused(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md border-b ${
      isDarkMode 
        ? 'bg-[#0D0D0D]/95 border-white/10 text-[#F5F5F0]' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Top Banner - Role Quick Status & Auth Button */}
      <div className={`px-4 py-1.5 text-xs border-b flex justify-between items-center ${
        isDarkMode ? 'bg-[#0A0A0A] border-white/10 text-white/60' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center space-x-3 overflow-x-auto py-0.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase bg-[#B59B6D]/20 text-[#B59B6D] border border-[#B59B6D]/30">
            ApexaLith Architecture
          </span>
          <span className="hidden sm:inline-block opacity-40">•</span>
          <span className="hidden sm:inline-block tracking-wider uppercase text-[10px] font-semibold">Institutional ConTech Platform</span>
        </div>

        {/* Role & Auth Sign In Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-[#B59B6D] text-black hover:bg-[#c4ab7d] transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Login</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-sm text-xs uppercase tracking-wider transition border ${
                isDarkMode 
                  ? 'bg-[#1A1A1A] border-white/10 hover:border-[#B59B6D] text-white/90' 
                  : 'bg-white border-slate-300 hover:border-[#B59B6D] text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#B59B6D]" />
              <span className="font-medium">Role: <strong className="capitalize text-[#B59B6D] font-bold">{currentRole}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className={`absolute right-0 mt-1 w-72 rounded-sm shadow-2xl border py-2 z-50 ${
                isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-white/90' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="px-3.5 py-2 text-xs font-bold text-[#B59B6D] uppercase tracking-[0.2em] border-b border-white/10">
                  Select User Context
                </div>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      onRoleChange(r.key);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#B59B6D]/10 transition ${
                      currentRole === r.key ? 'text-[#B59B6D] font-bold bg-[#B59B6D]/10' : ''
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-black/10 text-[#B59B6D] font-mono uppercase font-bold border border-[#B59B6D]/30">
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
          <div className="w-9 h-9 border border-[#B59B6D] flex items-center justify-center bg-[#0D0D0D] transition group-hover:border-[#B59B6D]">
            <span className="text-[#B59B6D] text-sm font-bold tracking-widest">AL</span>
          </div>
          <div>
            <span className={`text-xl font-bold tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Apexa<span className="text-[#B59B6D]">Lith</span>
            </span>
            <span className={`block text-[9px] uppercase tracking-[0.3em] font-bold ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
              Architectural Group
            </span>
          </div>
        </div>

        {/* Center Live Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
          <div className={`relative w-full rounded-sm border transition-all ${
            isDarkMode 
              ? 'bg-[#121212] border-white/20 text-white focus-within:border-[#B59B6D]' 
              : 'bg-slate-100 border-slate-300 text-slate-900 focus-within:border-[#B59B6D]'
          }`}>
            <Search className={`absolute left-3 top-2.5 w-4 h-4 ${isDarkMode ? 'text-white/50' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search projects, materials, specs, locations..."
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
              className="w-full bg-transparent pl-9 pr-9 py-2 text-sm focus:outline-none placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className={`absolute right-3 top-2.5 ${isDarkMode ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Large, Easy-to-Read Instant Search Results Dropdown Overlay */}
          {searchFocused && trimmedSearch.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-sm border shadow-2xl p-4 z-50 space-y-4 min-w-[380px] sm:min-w-[480px] max-h-[500px] overflow-y-auto ${
              isDarkMode ? 'bg-[#0D0D0D] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#B59B6D] border-b border-white/10 pb-2.5">
                <span>Search Matches for "{searchQuery}"</span>
                <span className="px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] text-[11px] font-mono">{totalMatches} Found</span>
              </div>

              {/* Projects */}
              {matchingProjects.length > 0 && (
                <div className="space-y-2">
                  <div className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    Featured Architectural Projects:
                  </div>
                  {matchingProjects.map(proj => (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectSearchResult('project', 'portfolio')}
                      className={`p-2.5 rounded-sm cursor-pointer transition flex items-center space-x-3.5 border ${
                        isDarkMode 
                          ? 'bg-[#141414] border-white/10 hover:border-[#B59B6D] hover:bg-[#1A1A1A]' 
                          : 'bg-slate-50 border-slate-200 hover:border-[#B59B6D] hover:bg-slate-100'
                      }`}
                    >
                      <img src={proj.heroImage} alt={proj.name} className="w-16 h-12 object-cover rounded-sm border border-black/20 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {proj.name}
                        </div>
                        <div className={`text-xs flex items-center space-x-2 mt-0.5 ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                          <span className="flex items-center text-[#B59B6D] font-medium">
                            <MapPin className="w-3 h-3 mr-1" />
                            {proj.location}
                          </span>
                          <span>•</span>
                          <span className="font-mono">{proj.builtUpSqFt.toLocaleString()} SQ FT</span>
                        </div>
                        <div className="text-[10px] text-[#B59B6D] uppercase font-semibold tracking-wider mt-1">
                          {proj.archetype} • {proj.stage}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Materials */}
              {matchingMaterials.length > 0 && (
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <div className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
                    Specification Materials:
                  </div>
                  {matchingMaterials.map(mat => (
                    <div
                      key={mat.id}
                      onClick={() => handleSelectSearchResult('material', 'materials')}
                      className={`p-2.5 rounded-sm cursor-pointer transition flex items-center justify-between border ${
                        isDarkMode 
                          ? 'bg-[#141414] border-white/10 hover:border-[#B59B6D]' 
                          : 'bg-slate-50 border-slate-200 hover:border-[#B59B6D]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-[#B59B6D]" />
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mat.name}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] font-mono uppercase font-bold">
                        {mat.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {totalMatches === 0 && (
                <div className={`text-sm text-center py-4 italic ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
                  No matching projects or materials found for "{searchQuery}".
                </div>
              )}

              <button
                onClick={() => handleSelectSearchResult('project', 'portfolio')}
                className="w-full py-2.5 rounded-sm bg-[#B59B6D] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#c4ab7d] transition flex items-center justify-center space-x-2 shadow-md"
              >
                <span>View Filtered Results in Spotlight</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Nav Items */}
        <nav className={`hidden lg:flex items-center space-x-1 text-xs uppercase tracking-[0.15em] font-bold ${
          isDarkMode ? 'text-white/70' : 'text-slate-600'
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
            onClick={() => onNavigateTab('bim_cad')}
            className={`px-3 py-1.5 transition flex items-center space-x-1.5 ${
              activeTab === 'bim_cad' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#B59B6D]" />
            <span>BIM/CAD</span>
          </button>

          <button
            onClick={() => onNavigateTab('interior_studio')}
            className={`px-3 py-1.5 transition flex items-center space-x-1.5 ${
              activeTab === 'interior_studio' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B59B6D]" />
            <span>AI Interior Studio</span>
          </button>

          <button
            onClick={() => onNavigateTab('walkthrough')}
            className={`px-3 py-1.5 transition flex items-center space-x-1.5 ${
              activeTab === 'walkthrough' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#B59B6D]" />
            <span>3D Studio</span>
          </button>

          <button
            onClick={() => onNavigateTab('portfolio')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'portfolio' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            Spotlight
          </button>

          <button
            onClick={() => onNavigateTab('domains')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'domains' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            14 Verticals
          </button>

          <button
            onClick={() => onNavigateTab('materials')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'materials' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
            }`}
          >
            Materials
          </button>

          {/* Role Specific Vault Links */}
          <button
            onClick={() => onNavigateTab('vault')}
            className={`px-3.5 py-1 rounded-sm transition flex items-center space-x-1.5 border ${
              activeTab === 'vault' ? 'border-[#B59B6D] bg-[#B59B6D] text-black font-bold' : 'border-[#B59B6D]/50 text-[#B59B6D] hover:bg-[#B59B6D] hover:text-black'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>VIP Vault</span>
          </button>

          {(currentRole === 'investor' || currentRole === 'admin') && (
            <button
              onClick={() => onNavigateTab('investor')}
              className={`px-3 py-1.5 transition flex items-center space-x-1 ${
                activeTab === 'investor' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Investor</span>
            </button>
          )}

          {(currentRole === 'broker' || currentRole === 'admin') && (
            <button
              onClick={() => onNavigateTab('broker')}
              className={`px-3 py-1.5 transition flex items-center space-x-1 ${
                activeTab === 'broker' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Broker</span>
            </button>
          )}

          {(currentRole === 'concierge' || currentRole === 'admin') && (
            <button
              onClick={() => onNavigateTab('admin')}
              className={`px-3 py-1.5 transition flex items-center space-x-1 ${
                activeTab === 'admin' ? 'text-[#B59B6D] border-b-2 border-[#B59B6D]' : isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CRM</span>
            </button>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAiAdvisor}
            className={`p-2 rounded-sm border transition ${
              isDarkMode 
                ? 'border-white/20 text-[#B59B6D] hover:bg-white/10' 
                : 'border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
            title="AI Architectural Advisor"
          >
            <Sparkles className="w-4 h-4 text-[#B59B6D]" />
          </button>

          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-sm border transition ${
              isDarkMode 
                ? 'border-white/20 text-[#B59B6D] hover:bg-white/10' 
                : 'border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onOpenEstimator}
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-sm border text-xs uppercase tracking-wider font-bold transition ${
              isDarkMode 
                ? 'border-[#B59B6D]/50 hover:border-[#B59B6D] text-white' 
                : 'border-slate-400 hover:border-[#B59B6D] text-slate-800'
            }`}
          >
            <span>Estimator</span>
          </button>

          <button
            onClick={onOpenConsultation}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-sm border border-[#B59B6D] text-[#B59B6D] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#B59B6D] hover:text-black transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Consultation</span>
            <span className="sm:hidden">Consult</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-5 py-6 space-y-3.5 ${
          isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search projects, materials, specs..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onNavigateTab('portfolio');
              }}
              className={`w-full rounded-sm px-3.5 py-2 text-sm border ${
                isDarkMode ? 'bg-[#121212] border-white/20 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <button
            onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 text-xs uppercase tracking-wider font-bold text-[#B59B6D] border-b border-white/10 flex items-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Admin Login</span>
          </button>

          <button
            onClick={() => { onNavigateTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            Public Showcase
          </button>
          <button
            onClick={() => { onNavigateTab('walkthrough'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10 flex items-center space-x-2 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-[#B59B6D]" />
            <span>3D Studio</span>
          </button>
          <button
            onClick={() => { onNavigateTab('portfolio'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            Project Spotlights
          </button>
          <button
            onClick={() => { onNavigateTab('domains'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            14 Core Verticals
          </button>
          <button
            onClick={() => { onNavigateTab('materials'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 text-xs uppercase tracking-wider font-semibold border-b border-white/10 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            Materials Showroom
          </button>
          <button
            onClick={() => { onNavigateTab('vault'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-xs uppercase tracking-wider font-bold text-[#B59B6D]"
          >
            VIP Client Vault
          </button>
        </div>
      )}
    </header>
  );
};
