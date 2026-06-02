import { useTranslation as useI18nextTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n, ready } = useI18nextTranslation();

  // Fonction utilitaire pour traduire avec variables
  const translate = (key, options = {}) => {
    return t(key, options);
  };

  // Obtenir la langue courante
  const currentLanguage = i18n.language;

  // Vérifier si la langue est RTL
  const isRTL = currentLanguage === 'ar';

  // Formater les nombres selon la langue
  const formatNumber = (number, options = {}) => {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
  };

  // Formater les dates selon la langue
  const formatDate = (date, options = {}) => {
    return new Intl.DateTimeFormat(currentLanguage, {
      dateStyle: options.dateStyle || 'medium',
      timeStyle: options.timeStyle || 'short',
      ...options
    }).format(new Date(date));
  };

  // Formater les durées
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return t('time.hours', { count: hours });
    }
    if (minutes > 0) {
      return t('time.minutes', { count: minutes });
    }
    return t('time.seconds', { count: secs });
  };

  return {
    t: translate,
    i18n,
    ready,
    currentLanguage,
    isRTL,
    formatNumber,
    formatDate,
    formatDuration
  };
};
