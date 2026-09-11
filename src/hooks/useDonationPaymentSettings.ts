import { useState, useEffect } from 'react';
import { DonationPaymentSettings } from '../types';
import {
  DEFAULT_DONATION_PAYMENT_SETTINGS,
  getDonationPaymentSettings,
  subscribeToDonationPaymentSettings
} from '../services/adminService';

export function useDonationPaymentSettings() {
  const [settings, setSettings] = useState<DonationPaymentSettings>(DEFAULT_DONATION_PAYMENT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Initial immediate fetch
    getDonationPaymentSettings().then((data) => {
      setSettings(data);
      setIsLoading(false);
    });

    // 2. Real-time subscription for instant multi-tab & Firestore sync
    const unsub = subscribeToDonationPaymentSettings((updated) => {
      setSettings(updated);
      setIsLoading(false);
    });

    return () => {
      if (typeof unsub === 'function') {
        unsub();
      }
    };
  }, []);

  return { settings, isLoading };
}
