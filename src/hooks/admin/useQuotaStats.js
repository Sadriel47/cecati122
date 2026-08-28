import { useState, useCallback } from 'react';
import { calculateStorageUsage } from '../../services/db';

export function useQuotaStats() {
  const [storageInfo, setStorageInfo] = useState(null);

  const fetchStorageInfo = useCallback(async () => {
    try {
      const info = await calculateStorageUsage();
      setStorageInfo(info);
    } catch (err) {
      console.warn("Error calculando cuotas de almacenamiento:", err);
    }
  }, []);

  return { storageInfo, fetchStorageInfo };
}
