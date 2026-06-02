import React from 'react';
import { Camera, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const QuickReportButton = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-bounce">
      <button
        onClick={onClick}
        className="group relative flex items-center justify-center w-20 h-20 bg-red-600 text-white rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-110 active:scale-95 transition-all"
      >
        <span className="absolute -top-12 right-0 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase whitespace-nowrap shadow-lg">
          {t('urgent_report')}
        </span>
        <AlertTriangle size={40} className="group-hover:hidden" />
        <Camera size={40} className="hidden group-hover:block" />
      </button>
    </div>
  );
};

export default QuickReportButton;
