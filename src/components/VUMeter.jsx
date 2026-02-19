const VUMeter = ({ value, label, max = 100 }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#AAA',
          }}>{label}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            fontWeight: 700,
            color: pct >= 75 ? '#1A1A1A' : '#888',
          }}>
            {Math.round(pct)}%
          </span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: '6px',
        borderRadius: '3px',
        background: 'rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: '3px',
          background: pct >= 75 ? '#1A1A1A' : pct >= 40 ? '#888' : '#CCC',
          transition: 'width 0.5s ease-out',
        }} />
      </div>
    </div>
  );
};

export default VUMeter;
