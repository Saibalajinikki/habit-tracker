import { useRef, useCallback, useEffect, useState } from 'react';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const MonthKnob = ({ month, year, onMonthChange, onYearChange, playClick }) => {
  const knobRef = useRef(null);
  const dragging = useRef(false);
  const startAngle = useRef(0);
  const startMonth = useRef(month);

  const rotation = (month / 12) * 360;

  const getAngle = useCallback((e) => {
    const rect = knobRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }, []);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    startAngle.current = getAngle(e);
    startMonth.current = month;
  }, [getAngle, month]);

  const handleMove = useCallback((e) => {
    if (!dragging.current) return;
    const current = getAngle(e);
    let delta = current - startAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const monthDelta = Math.round(delta / 30);
    const newMonth = ((startMonth.current + monthDelta) % 12 + 12) % 12;
    if (newMonth !== month) {
      playClick?.('knob');
      onMonthChange(newMonth);
    }
  }, [getAngle, month, onMonthChange, playClick]);

  const handleEnd = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [handleMove, handleEnd]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1 : -1;
    const newMonth = ((month + dir) % 12 + 12) % 12;
    playClick?.('knob');
    onMonthChange(newMonth);
  }, [month, onMonthChange, playClick]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Year controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { playClick?.('switch'); onYearChange(year - 1); }}
          className="te-btn px-3 py-1"
        >-</button>
        <span className="font-mono text-lg font-bold text-te-text tabular-nums">{year}</span>
        <button
          onClick={() => { playClick?.('switch'); onYearChange(year + 1); }}
          className="te-btn px-3 py-1"
        >+</button>
      </div>

      {/* Knob */}
      <div className="knob-outer" onWheel={handleWheel}>
        {/* Month labels (outer ring) */}
        {MONTHS.map((m, i) => {
          const angle = (i / 12) * 360 - 90;
          const rad = angle * (Math.PI / 180);
          const r = 96;
          const x = 105 + Math.cos(rad) * r;
          const y = 105 + Math.sin(rad) * r;
          return (
            <span
              key={`l-${m}`}
              className="knob-label cursor-pointer"
              style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
                color: i === month ? 'var(--accent)' : undefined,
                fontWeight: i === month ? 700 : 400,
              }}
              onClick={() => {
                playClick?.('knob');
                onMonthChange(i);
              }}
            >
              {m}
            </span>
          );
        })}

        {/* Detent dots (between labels and knob) */}
        {MONTHS.map((m, i) => {
          const angle = (i / 12) * 360 - 90;
          const rad = angle * (Math.PI / 180);
          const r = 78;
          const x = 105 + Math.cos(rad) * r;
          const y = 105 + Math.sin(rad) * r;
          const active = i === month;
          return (
            <div
              key={m}
              className="knob-detent"
              style={{
                left: x - 2.5,
                top: y - 2.5,
                background: active ? 'var(--accent)' : 'var(--muted)',
                boxShadow: active ? '0 0 6px color-mix(in srgb, var(--accent) 60%, transparent)' : 'none',
              }}
              onClick={() => {
                playClick?.('knob');
                onMonthChange(i);
              }}
            />
          );
        })}

        {/* Knob body */}
        <div
          ref={knobRef}
          className="knob-body"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="knob-indicator" />
        </div>

        <div className="knob-cap" />
      </div>

      {/* Current month label */}
      <span className="font-mono text-xs font-bold text-te-accent tracking-widest uppercase">
        {MONTHS[month]} {year}
      </span>
    </div>
  );
};

export default MonthKnob;
