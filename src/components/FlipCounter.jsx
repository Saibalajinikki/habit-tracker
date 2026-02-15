import { useEffect, useRef } from 'react';

const FlipCounter = ({ value, digits = 3, label }) => {
  const str = String(Math.max(0, value)).padStart(digits, '0');

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5">
        {str.split('').map((d, i) => (
          <Digit key={i} digit={d} />
        ))}
      </div>
      {label && (
        <span className="font-mono text-[9px] font-bold text-te-muted tracking-widest uppercase">
          {label}
        </span>
      )}
    </div>
  );
};

const Digit = ({ digit }) => {
  const ref = useRef(null);
  const num = parseInt(digit, 10);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translateY(-${num * 40}px)`;
    }
  }, [num]);

  return (
    <div className="flip-digit">
      <div ref={ref} className="flip-digit-inner">
        {[0,1,2,3,4,5,6,7,8,9].map(n => (
          <div
            key={n}
            className="w-full h-[40px] flex items-center justify-center font-mono text-lg font-bold text-te-text tabular-nums"
          >
            {n}
          </div>
        ))}
      </div>
      <div className="flip-digit-line" />
    </div>
  );
};

export default FlipCounter;
