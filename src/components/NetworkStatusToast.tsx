import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const NetworkStatusToast: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>आप ऑफलाइन हैं (Offline Mode - Local features available)</span>
    </div>
  );
};

export default NetworkStatusToast;
