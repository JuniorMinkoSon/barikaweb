import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { theme } from '../../theme';
import { User, UserRole } from './types';

interface HeroSectionProps {
  user: User;
  role: UserRole;
  isSellerApproved: boolean;
  setRole: (role: UserRole) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  user,
  role,
  isSellerApproved,
  setRole,
}) => {
  return (
    <div className="relative pt-14 pb-32 px-6 overflow-hidden transition-colors duration-500" style={{ backgroundColor: role === 'seller' ? theme.colors.gray[900] : theme.colors.secondary }}>
      <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full opacity-20 blur-[80px]" style={{ backgroundColor: theme.colors.primary }} />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl border border-white/10" style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #FF9F6B 100%)` }}>
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 rounded-full" style={{ borderColor: role === 'seller' ? theme.colors.gray[900] : theme.colors.secondary }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight flex items-center gap-3">
              {user.firstName} {user.lastName}
              {role === 'seller' && <span className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded-md uppercase">Vendeur</span>}
            </h1>
            <p className="font-medium text-xs mt-1 uppercase tracking-[3px]" style={{ color: theme.colors.gray[400] }}>{user.id}</p>
          </div>
        </div>

        {isSellerApproved && (
          <button onClick={() => setRole(role === 'customer' ? 'seller' : 'customer')} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-95">
            <ArrowLeftRight size={18} />
            <span className="font-bold text-sm">Mode {role === 'customer' ? 'Vendeur' : 'Client'}</span>
          </button>
        )}
      </div>
    </div>
  );
};