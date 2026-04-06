import React from 'react';
import { theme } from '../../theme';

interface ModalButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const ModalButton: React.FC<ModalButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  const base = "w-full py-4 rounded-2xl font-bold transition-all active:scale-95 mt-2 text-sm flex items-center justify-center gap-2";
  const styles = {
    primary: { backgroundColor: theme.colors.primary, color: '#FFFFFF' },
    secondary: { backgroundColor: theme.colors.gray[50], color: theme.colors.gray[700], border: `1px solid ${theme.colors.gray[200]}` },
    danger: { backgroundColor: '#E53E3E', color: '#FFFFFF' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${disabled ? 'opacity-50' : 'hover:opacity-90'}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
};