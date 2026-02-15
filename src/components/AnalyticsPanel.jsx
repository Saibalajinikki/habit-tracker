import VUMeter from './VUMeter';

const DOW = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS_MINI = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const AnalyticsPanel = ({
  habits,
  getHabitRate,
  getHabitStreak,
  getTotal,
  daysInMonth,
  weekdayPattern,
  yearlyOverview,
  selectedMonth,
  selectedYear,
}) => {
  if (habits.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-16 pt-8 border-t border-te-border">
      {/* ── Per-Habit Cards ── */}
      <div>
        <span className="font-mono text-[9px] text-te-muted uppercase tracking-widest block mb-3">
          Habit Analytics
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {habits.map(h => {
            const rate = getHabitRate(h.id);
            const streak = getHabitStreak(h.id);
            const total = getTotal(h.id);
            return (
              <div
                key={h.id}
                className="border border-te-border bg-te-surface p-4"
                style={{ borderRadius: '3px' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-te-text uppercase tracking-wider">
                    {h.name}
                  </span>
                  <span className="font-mono text-lg font-bold text-te-accent tabular-nums">
                    {total}
                    <span className="text-te-muted text-xs">/{daysInMonth}</span>
                  </span>
                </div>
                <VUMeter value={rate} label="Rate" />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-te-accent" />
                    <span className="font-mono text-[9px] text-te-muted uppercase">Streak</span>
                    <span className="font-mono text-xs font-bold text-te-text tabular-nums">{streak.current}d</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-te-muted uppercase">Best</span>
                    <span className="font-mono text-xs font-bold text-te-text tabular-nums">{streak.best}d</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row: Weekly Pattern + Yearly Overview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Pattern */}
        <div
          className="border border-te-border bg-te-surface p-4"
          style={{ borderRadius: '3px' }}
        >
          <span className="font-mono text-[9px] text-te-muted uppercase tracking-widest block mb-3">
            Weekly Pattern
          </span>
          <div className="flex flex-col gap-2">
            {DOW.map((day, i) => (
              <div key={day} className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-bold text-te-muted w-7">{day}</span>
                <div className="flex-1 h-2 bg-te-border rounded-sm overflow-hidden" style={{ borderRadius: '1px' }}>
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${weekdayPattern[i]}%`,
                      background: weekdayPattern[i] > 75
                        ? 'var(--accent)'
                        : weekdayPattern[i] > 40
                          ? 'var(--accent-dim)'
                          : 'var(--muted)',
                      borderRadius: '1px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <span className="font-mono text-[9px] font-bold text-te-text tabular-nums w-8 text-right">
                  {weekdayPattern[i]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Yearly Overview */}
        <div
          className="border border-te-border bg-te-surface p-4"
          style={{ borderRadius: '3px' }}
        >
          <span className="font-mono text-[9px] text-te-muted uppercase tracking-widest block mb-3">
            {selectedYear} Overview
          </span>
          <div className="grid grid-cols-6 gap-2">
            {MONTHS_MINI.map((m, i) => {
              const pct = yearlyOverview[i];
              const isCurrent = i === selectedMonth;
              return (
                <div key={m} className="flex flex-col items-center gap-1">
                  <span className={`font-mono text-[8px] font-bold tracking-wider ${
                    isCurrent ? 'text-te-accent' : 'text-te-muted'
                  }`}>
                    {m}
                  </span>
                  {/* Mini VU block */}
                  <div className="w-full h-8 bg-te-border relative overflow-hidden" style={{ borderRadius: '2px' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: `${pct}%`,
                        background: pct > 75
                          ? 'var(--accent)'
                          : pct > 40
                            ? 'var(--accent-dim)'
                            : pct > 0
                              ? 'var(--muted)'
                              : 'transparent',
                        transition: 'height 0.5s ease',
                        borderRadius: '1px',
                      }}
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 border border-te-accent" style={{ borderRadius: '2px' }} />
                    )}
                  </div>
                  <span className="font-mono text-[8px] text-te-muted tabular-nums">
                    {pct > 0 ? `${pct}%` : '--'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
