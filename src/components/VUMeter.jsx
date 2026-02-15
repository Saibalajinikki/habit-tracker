const VUMeter = ({ value, label, max = 100 }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] font-bold text-te-muted tracking-widest uppercase">
            {label}
          </span>
          <span className="font-mono text-xs font-bold text-te-text tabular-nums">
            {Math.round(pct)}%
          </span>
        </div>
      )}
      <div className="vu-meter">
        <div className="vu-fill" style={{ width: `${pct}%` }} />
        {/* Quarter marks */}
        <div className="vu-mark" style={{ left: '25%' }} />
        <div className="vu-mark" style={{ left: '50%' }} />
        <div className="vu-mark" style={{ left: '75%' }} />
      </div>
    </div>
  );
};

export default VUMeter;
