import React from 'react';
import { humanizeStatus } from '../utils/formatters';
import { CheckCircle, Clock, ShieldCheck, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  status: string;
}

export const EscrowStatusBadge: React.FC<Props> = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let Icon = Clock;

  switch (status) {
    case 'EN_ATTENTE_DE_PAIEMENT':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      Icon = Clock;
      break;
    case 'PAYE':
      // Visual indicator for Escrow (Séquestre)
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      Icon = ShieldCheck;
      break;
    case 'COURSE_DEMARREE':
    case 'SUR_PLACE':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      Icon = AlertCircle;
      break;
    case 'TERMINE':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      Icon = CheckCircle;
      break;
    case 'ANNULE':
    case 'REFUSE':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      Icon = XCircle;
      break;
      
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <Icon size={14} className={textColor} />
      {humanizeStatus(status)}
    </span>
  );
};
