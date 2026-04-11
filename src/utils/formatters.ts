/**
 * Formats a number to FCFA strictly following the requirement.
 * Will add spaces as thousand separators and force max 2 decimals if not integer.
 */
export const formatFCFA = (amount: number): string => {
  if (amount == null) return '0 FCFA';
  
  // Format with Intl.NumberFormat specifically for West African Locale 'fr-CI'
  // But enforcing custom 'FCFA' suffix manually for consistency
  const formatter = new Intl.NumberFormat('fr-CI', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${formatter.format(amount)} FCFA`;
};

/**
 * Format string statuses to human-readable strings
 */
export const humanizeStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'EN_ATTENTE_DE_PAIEMENT': 'En attente de paiement',
    'PAYE': 'Fonds Sécurisés (Séquestre)',
    'COURSE_DEMARREE': 'En cours',
    'SUR_PLACE': 'Sur place',
    'TERMINE': 'Terminé',
    'ANNULE': 'Annulé',
    'REFUSE': 'Refusé'
  };

  return statusMap[status] || status;
};
