import { useState, useEffect, useCallback } from 'react';

export const THEMES = [
  {
    id: 'habitflow',
    name: 'HabitFlow',
    product: 'Default',
    accent: '#9EF01A',
    accentDim: '#7BC214',
    accentHover: '#B8F548',
    preview: '#9EF01A',
  },
  {
    id: 'op1',
    name: 'OP-1',
    product: 'Classic Blue',
    accent: '#1270B8',
    accentDim: '#0E5A94',
    accentHover: '#2B8AD4',
    preview: '#1270B8',
  },
  {
    id: 'opz',
    name: 'OP-Z',
    product: 'Signal Yellow',
    accent: '#F9A800',
    accentDim: '#D49000',
    accentHover: '#FFBE33',
    preview: '#F9A800',
  },
  {
    id: 'opxy',
    name: 'OP-XY',
    product: 'Record Red',
    accent: '#CE2021',
    accentDim: '#A81A1A',
    accentHover: '#E84344',
    preview: '#CE2021',
  },
  {
    id: 'ep133',
    name: 'EP-133',
    product: 'Sampler Orange',
    accent: '#FA5B1C',
    accentDim: '#D44A12',
    accentHover: '#FF7A45',
    preview: '#FA5B1C',
  },
  {
    id: 'te-brand',
    name: 'TE Brand',
    product: 'Magenta',
    accent: '#FF0185',
    accentDim: '#D4006E',
    accentHover: '#FF3DA3',
    preview: '#FF0185',
  },
  {
    id: 'ob4-navy',
    name: 'OB-4',
    product: 'Navy',
    accent: '#4A8FCC',
    accentDim: '#1B2A4A',
    accentHover: '#6BACDF',
    preview: '#4A8FCC',
  },
  {
    id: 'modular',
    name: 'PO-400',
    product: 'Modular Yellow',
    accent: '#FFC003',
    accentDim: '#D4A020',
    accentHover: '#FFD044',
    preview: '#FFC003',
  },
  {
    id: 'off-white',
    name: 'Off-White',
    product: 'Virgil Abloh',
    accent: '#FF6B2B',
    accentDim: '#D45520',
    accentHover: '#FF8A55',
    preview: '#FF6B2B',
  },
  {
    id: 'pocket-purple',
    name: 'PO-20',
    product: 'Arcade Purple',
    accent: '#7B2D8E',
    accentDim: '#5E2270',
    accentHover: '#9B48AE',
    preview: '#7B2D8E',
  },
  {
    id: 'op1-field',
    name: 'OP-1 Field',
    product: 'Ochre',
    accent: '#C8960C',
    accentDim: '#A07808',
    accentHover: '#E0AE2E',
    preview: '#C8960C',
  },
  {
    id: 'pocket-green',
    name: 'PO-12',
    product: 'Rhythm Green',
    accent: '#1AA167',
    accentDim: '#148A56',
    accentHover: '#22C47D',
    preview: '#1AA167',
  },
];

export const useTheme = () => {
  const [themeId, setThemeId] = useState(() =>
    localStorage.getItem('te-theme') || 'habitflow'
  );

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const applyTheme = useCallback((t) => {
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-dim', t.accentDim);
    root.style.setProperty('--accent-hover', t.accentHover);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('te-theme', theme.id);
  }, [theme, applyTheme]);

  const setTheme = useCallback((id) => {
    setThemeId(id);
  }, []);

  return { theme, themeId, setTheme, themes: THEMES };
};
