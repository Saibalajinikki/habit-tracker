import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FlipCounter = ({ value, digits = 3, label }) => {
  const str = String(Math.max(0, value)).padStart(digits, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5">
        {str.split('').map((d, i) => (
          <Digit key={i} digit={d} />
        ))}
      </div>
      {label && (
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#AAA',
        }}>
          {label}
        </span>
      )}
    </div>
  );
};

const DIGIT_HEIGHT = 52;

const Digit = ({ digit }) => {
  const ref = useRef(null);
  const num = parseInt(digit, 10);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translateY(-${num * DIGIT_HEIGHT}px)`;
    }
  }, [num]);

  return (
    <div style={{
      height: `${DIGIT_HEIGHT}px`,
      width: '40px',
      overflow: 'hidden',
      background: '#FAFAF8',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: '8px',
      position: 'relative',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)',
    }}>
      <div ref={ref} style={{ transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <div
            key={n}
            className="w-full flex items-center justify-center"
            style={{
              height: `${DIGIT_HEIGHT}px`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '20px',
              fontWeight: 700,
              color: '#1A1A1A',
            }}
          >
            {n}
          </div>
        ))}
      </div>
      {/* Center split line */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: '1px',
        background: 'rgba(0,0,0,0.06)',
      }} />
    </div>
  );
};

export default FlipCounter;
