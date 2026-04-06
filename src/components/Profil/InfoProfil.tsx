import React from 'react';
import { theme } from '../../theme';
import { User } from './types';

interface InfoCardProps {
  user: User;
  onEdit: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({ user, onEdit }) => {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border" style={{ borderColor: theme.colors.gray[100] }}>
      <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.colors.gray[50] }}>
        <span className="text-[10px] font-bold tracking-[2px] uppercase text-gray-400">Infos Personnelles</span>
        <button onClick={onEdit} className="text-xs font-bold px-4 py-2 rounded-xl" style={{ color: theme.colors.primary, backgroundColor: theme.colors.primaryLight }}>Modifier</button>
      </div>
      <div className="divide-y" style={{ borderColor: theme.colors.gray[50] }}>
        {[
          { label: 'PRÉNOM', val: user.firstName },
          { label: 'NOM', val: user.lastName },
          { label: 'EMAIL', val: user.email },
          { label: 'MOBILE', val: user.phone },
        ].map((item) => (
          <div key={item.label} className="px-8 py-4 hover:bg-slate-50 transition-colors">
            <p className="text-[10px] font-bold tracking-wider mb-1 text-gray-400">{item.label}</p>
            <p className="font-semibold text-gray-800">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};