import React, { useEffect } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';

const RTLProvider = ({ children }) => {
  const { i18n } = useI18nextTranslation();

  useEffect(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
    
    // Ajouter une classe CSS pour le RTL
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  return <>{children}</>;
};

export default RTLProvider;
