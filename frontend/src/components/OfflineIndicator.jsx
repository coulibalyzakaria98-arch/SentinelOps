import React from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const isOnline = useNetworkStatus();
  const { t } = useTranslation();

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span>{t('online_msg')}</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>{t('offline_msg')}</span>
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;
