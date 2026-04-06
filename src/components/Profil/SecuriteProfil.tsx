import React from 'react';
import { Lock, LogOut, ChevronRight } from 'lucide-react';
import { theme } from '../../theme';

interface SecurityCardProps {
  onChangePass: () => void;
  onLogout: () => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ onChangePass, onLogout }) => {
  return (
    <div className="bg-white rounded-[32px] p-2 shadow-sm border" style={{ borderColor: theme.colors.gray[100] }}>
      <div className="p-4 px-6 border-b" style={{ borderColor: theme.colors.gray[50] }}>
        <span className="text-[10px] font-bold tracking-[2px] uppercase text-gray-400">Sécurité & Compte</span>
      </div>
      <div className="p-2 space-y-1">
        <button onClick={onChangePass} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group text-left">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primary }}><Lock size={18} /></div>
          <span className="flex-1 font-semibold text-gray-700">Changer le mot de passe</span>
          <ChevronRight size={18} className="text-gray-300" />
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 transition-colors group text-left">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all"><LogOut size={18} /></div>
          <span className="flex-1 font-semibold text-red-500">Déconnexion</span>
          <ChevronRight size={18} className="text-red-200" />
        </button>
      </div>
    </div>
  );
};