import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { theme } from '../../theme';
import { FAQItem } from './types';

interface FAQSectionProps {
  faqs: FAQItem[];
  openFaq: number | null;
  setOpenFaq: (index: number | null) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, openFaq, setOpenFaq }) => {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border" style={{ borderColor: theme.colors.gray[100] }}>
      <div className="p-6 border-b flex items-center gap-2" style={{ borderColor: theme.colors.gray[50] }}>
        <AlertCircle size={14} className="text-gray-400" />
        <span className="text-[10px] font-bold tracking-[2px] uppercase text-gray-400">Aide & FAQ</span>
      </div>
      {faqs.map((f, i) => (
        <div key={i} className="border-b last:border-0" style={{ borderColor: theme.colors.gray[50] }}>
          <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <span className="text-sm font-semibold text-left text-gray-700">{f.q}</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${openFaq === i ? 'rotate-180' : ''}`} style={{ backgroundColor: openFaq === i ? theme.colors.primaryLight : theme.colors.gray[100] }}>
              <ChevronDown size={14} style={{ color: openFaq === i ? theme.colors.primary : theme.colors.gray[500] }} />
            </div>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 p-6 pt-0' : 'max-h-0'}`}>
            <p className="text-sm leading-relaxed text-gray-500">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
};