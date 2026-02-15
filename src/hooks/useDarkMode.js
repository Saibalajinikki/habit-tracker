import { useState, useEffect, useCallback } from 'react';

export const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('te-dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('te-dark', dark);
  }, [dark]);

  const toggle = useCallback(() => setDark(prev => !prev), []);

  return { dark, toggle };
};
