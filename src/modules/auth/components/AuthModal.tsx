import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  UserCheck, 
  Key, 
  CheckCircle2, 
  X, 
  Briefcase,
  Compass,
  Building2
} from 'lucide-react';
import { UserRole } from '../../../types';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, targetTab?: string) => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isDarkMode
}) => {
  const [authType, setAuthType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('homeowner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      if (authType === 'admin') {
        if (password.length > 0 || twoFactorCode.length > 0) {
          setSuccessMessage('Admin Credentials Verified. Authenticating 2FA Vault...');
          setTimeout(() => {
            onLoginSuccess('admin', 'admin');
            onClose();
          }, 800);
        } else {
          setErrorMessage('Please enter password or use 1-click Admin login below.');
        }
      } else {
        setSuccessMessage(`Authenticated as ${selectedRole.toUpperCase()}. Welcome back.`);
        setTimeout(() => {
          let targetTab = 'vault';
          if (selectedRole === 'investor') targetTab = 'investor';
          if (selectedRole === 'broker') targetTab = 'broker';
          onLoginSuccess(selectedRole, targetTab);
          onClose();
        }, 800);
      }
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole, targetTab: string) => {
    setIsSubmitting(true);
    setSuccessMessage(`Authenticating 1-click demo session as ${role.toUpperCase()}...`);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(role, targetTab);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`relative max-w-lg w-full rounded-sm border p-6 sm:p-8 space-y-6 ${
        isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-[#F5F5F0]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-sm text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-sm bg-[#B59B6D]/20 border border-[#B59B6D]/40 text-[#B59B6D] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Lock className="w-3 h-3" />
            <span>ApexaLith Identity Vault</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F0]">
            Sign In & Platform Context
          </h2>
          <p className="text-xs text-white/50">
            Access your encrypted client vault, investor ROI dashboards, or executive command center.
          </p>
        </div>

        {/* Tab Switcher: Client / Admin */}
        <div className="grid grid-cols-2 p-1 bg-[#121212] border border-white/10 rounded-sm text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => { setAuthType('user'); setErrorMessage(null); }}
            className={`py-2 rounded-sm transition flex items-center justify-center space-x-2 ${
              authType === 'user' ? 'bg-[#B59B6D] text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Client / Partner</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthType('admin'); setErrorMessage(null); }}
            className={`py-2 rounded-sm transition flex items-center justify-center space-x-2 ${
              authType === 'admin' ? 'bg-[#B59B6D] text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Command</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="p-3 rounded-sm bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs flex items-center space-x-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-sm bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authType === 'user' && (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Select Client Role Context</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
              >
                <option value="homeowner">VIP Homeowner (Client Vault & Live Cameras)</option>
                <option value="investor">Real Estate Investor (Financial ROI & Variance)</option>
                <option value="broker">Broker Partner (Referrals & Commission Pipeline)</option>
                <option value="architect">Architect / Engineer (CAD Blueprints & Specs)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">
              {authType === 'admin' ? 'Super Administrator Email' : 'Email Address / Account ID'}
            </label>
            <input
              type="email"
              placeholder={authType === 'admin' ? 'admin@apexalith.com' : 'client@apexalith.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">
              Passcode / Security Token
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
            />
          </div>

          {authType === 'admin' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#B59B6D] mb-1">
                2FA Hardware Authenticator Token (PRD Sec 5.2)
              </label>
              <input
                type="text"
                placeholder="6-digit TOTP e.g. 849201"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full bg-[#121212] border border-[#B59B6D]/40 rounded-sm px-3.5 py-2 text-xs text-[#B59B6D] font-mono focus:outline-none focus:border-[#B59B6D]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#c4ab7d] transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Authenticating...' : `Sign In as ${authType === 'admin' ? 'Super Admin' : selectedRole}`}</span>
          </button>
        </form>

        {/* 1-Click Quick Demo Login Section */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
            <span>Instant 1-Click Demo Login:</span>
            <span className="text-[#B59B6D]">No password required</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('homeowner', 'vault')}
              className="px-3 py-2 rounded-sm bg-[#121212] border border-white/10 hover:border-[#B59B6D] text-[10px] font-bold uppercase tracking-wider text-white/80 transition flex items-center space-x-1.5"
            >
              <Building2 className="w-3 h-3 text-[#B59B6D]" />
              <span>VIP Client Vault</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('investor', 'investor')}
              className="px-3 py-2 rounded-sm bg-[#121212] border border-white/10 hover:border-[#B59B6D] text-[10px] font-bold uppercase tracking-wider text-white/80 transition flex items-center space-x-1.5"
            >
              <Briefcase className="w-3 h-3 text-[#B59B6D]" />
              <span>Investor ROI</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('broker', 'broker')}
              className="px-3 py-2 rounded-sm bg-[#121212] border border-white/10 hover:border-[#B59B6D] text-[10px] font-bold uppercase tracking-wider text-white/80 transition flex items-center space-x-1.5"
            >
              <Compass className="w-3 h-3 text-[#B59B6D]" />
              <span>Broker Partner</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('admin', 'admin')}
              className="px-3 py-2 rounded-sm bg-[#121212] border border-[#B59B6D]/40 hover:border-[#B59B6D] text-[10px] font-bold uppercase tracking-wider text-[#B59B6D] transition flex items-center space-x-1.5"
            >
              <Shield className="w-3 h-3 text-[#B59B6D]" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
