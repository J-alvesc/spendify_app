import { useState, useEffect } from 'react';

const STORAGE_KEY = 'spendify_hide_values';

export function usePrivacy() {
  const [hideValues, setHideValues] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hideValues));
    } catch {
      // Ignora erro de localStorage
    }
  }, [hideValues]);

  const toggleHideValues = () => setHideValues((prev) => !prev);

  return {
    hideValues,
    toggleHideValues,
    formatPrivate: (value: string | number, formatter?: (v: number) => string) => {
      if (hideValues) return '••••••';
      if (typeof value === 'number' && formatter) return formatter(value);
      return String(value);
    },
  };
}

