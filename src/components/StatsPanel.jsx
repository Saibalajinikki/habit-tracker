const StatsPanel = ({ totalCompleted, completionRate, currentStreak, perfectDays }) => {
  const stats = [
    { value: totalCompleted, label: 'completed' },
    { value: `${completionRate}%`, label: 'rate' },
    { value: currentStreak, label: 'streak' },
    { value: perfectDays, label: 'perfect' },
  ];

  return (
    <div className="flex items-center justify-center gap-8 py-5 px-6 border-t border-te-border bg-te-surface">
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-te-accent" style={{
            boxShadow: '0 0 4px rgba(158,240,26,0.5)',
          }} />
          <span className="font-mono text-xs font-bold text-te-text tabular-nums">{s.value}</span>
          <span className="font-mono text-[9px] text-te-muted uppercase tracking-wider">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
