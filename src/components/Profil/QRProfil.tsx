import React from 'react';
import { theme } from '../../theme';

interface QRCardProps {
  qrUrl: string;
  userId: string;
}

export const QRCard: React.FC<QRCardProps> = ({ qrUrl, userId }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border overflow-hidden" style={{ borderColor: theme.colors.gray[100] }}>
      <div className="flex items-center gap-6">
        <div className="p-3 border rounded-2xl shrink-0" style={{ backgroundColor: theme.colors.gray[50], borderColor: theme.colors.gray[100] }}>
          {qrUrl && <img src={qrUrl} alt="QR" className="w-24 h-24" />}
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">ID Client Unique</p>
          <p className="font-mono font-bold text-lg text-gray-800">{userId}</p>
          <p className="text-[10px]" style={{ color: theme.colors.primary }}>Badge de confiance</p>
        </div>
      </div>
    </div>
  );
};