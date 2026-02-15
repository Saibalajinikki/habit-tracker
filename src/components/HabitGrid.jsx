import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const HabitGrid = ({
  habits,
  year,
  month,
  isCompleted,
  getTotal,
  isPerfectDay,
  onToggle,
  onDeleteHabit,
  onOpenAddModal,
  playClick,
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const rows = gridRef.current.querySelectorAll('.habit-row');
    gsap.fromTo(rows,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
    );
  }, [habits.length, month, year]);

  const handleToggle = (habitId, day) => {
    playClick?.('toggle');
    onToggle(habitId, day);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-te-text">
            {MONTH_NAMES[month]}
            <span className="text-te-muted text-base ml-2">{year}</span>
          </h2>
        </div>
        <button onClick={onOpenAddModal} className="te-btn-primary flex items-center gap-2">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          ADD
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-2" ref={gridRef}>
        <div className="inline-block min-w-full">
          {/* Day numbers header */}
          <div className="flex items-center gap-[2px] mb-1">
            <div className="w-40 min-w-[160px] flex-shrink-0" />
            {days.map(d => {
              const isToday = isCurrentMonth && d === currentDay;
              const perfect = isPerfectDay(d);
              return (
                <div
                  key={d}
                  className="w-[22px] flex-shrink-0 flex items-center justify-center"
                >
                  <span className={`font-mono text-[9px] font-bold ${
                    isToday ? 'text-te-accent' : perfect ? 'text-te-accent-dim' : 'text-te-muted'
                  }`}>
                    {d}
                  </span>
                </div>
              );
            })}
            <div className="w-12 text-center font-mono text-[9px] font-bold text-te-muted ml-1">
              TOT
            </div>
          </div>

          {/* Habit rows */}
          {habits.map(h => (
            <div key={h.id} className="habit-row flex items-center gap-[2px] mb-[2px] group">
              {/* Habit name */}
              <div className="w-40 flex items-center gap-1 pr-2 min-w-[160px] flex-shrink-0">
                <span className="font-mono text-xs font-bold text-te-text truncate flex-1 uppercase tracking-wider">
                  {h.name}
                </span>
                <button
                  onClick={() => { playClick?.('switch'); onDeleteHabit(h.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-te-muted hover:text-red-500 transition-all"
                  title="Delete habit"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* LED strip */}
              {days.map(d => {
                const completed = isCompleted(h.id, d);
                const perfect = isPerfectDay(d);
                const isToday = isCurrentMonth && d === currentDay;
                return (
                  <button
                    key={d}
                    onClick={() => handleToggle(h.id, d)}
                    className={`led ${completed ? 'on' : ''} ${isToday && !completed ? 'today' : ''} ${completed && perfect ? 'perfect' : ''}`}
                  />
                );
              })}

              {/* Total */}
              <div className={`w-12 text-center font-mono text-xs font-bold tabular-nums ml-1 ${
                getTotal(h.id) === daysInMonth ? 'text-te-accent' : 'text-te-text'
              }`}>
                {getTotal(h.id)}/{daysInMonth}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {habits.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-mono text-sm text-te-muted">NO HABITS CONFIGURED</p>
              <button onClick={onOpenAddModal} className="te-btn mt-4">
                + ADD YOUR FIRST HABIT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitGrid;
