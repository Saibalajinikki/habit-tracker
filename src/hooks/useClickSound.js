import { useState, useCallback, useRef } from 'react';

export const useClickSound = () => {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('te-sound') !== 'off');
  const ctxRef = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const playClick = useCallback((type = 'toggle') => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const duration = type === 'toggle' ? 0.025 : type === 'knob' ? 0.035 : 0.02;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.exp(-i / (bufferSize * 0.12));
        data[i] = (Math.random() * 2 - 1) * envelope;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = type === 'toggle' ? 4500 : type === 'knob' ? 2000 : 3000;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.value = type === 'toggle' ? 0.12 : 0.08;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {
      // AudioContext not available
    }
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      localStorage.setItem('te-sound', next ? 'on' : 'off');
      return next;
    });
  }, []);

  return { playClick, enabled, toggle };
};
