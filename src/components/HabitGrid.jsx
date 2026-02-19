import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
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
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
    );
  }, [habits.length, month, year]);

  const handleToggle = (habitId, day) => {
    playClick?.('toggle');
    onToggle(habitId, day);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {MONTH_NAMES[month]} <span className="text-gray-400 font-medium text-lg ml-2">{year}</span>
          </h2>
        </div>
        <motion.button
          onClick={onOpenAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full font-medium text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          ADD
        </motion.button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-2 hide-scrollbar" ref={gridRef}>
        <div className="inline-block min-w-full">
          {/* Day numbers header */}
          <div className="flex items-center gap-[4px] mb-3">
            <div className="w-40 min-w-[160px] flex-shrink-0" />
            {days.map(d => {
              const isToday = isCurrentMonth && d === currentDay;
              return (
                <div
                  key={d}
                  className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-[10px] font-bold ${isToday ? 'bg-black text-white shadow-md' : 'text-gray-400'
                    }`}
                >
                  {d}
                </div>
              );
            })}
            <div className="w-14 text-center ml-2 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
              TOT
            </div>
          </div>

          {/* Habit rows */}
          <div className="flex flex-col gap-2">
            {habits.map((h, rowIdx) => (
              <motion.div
                key={h.id}
                className="habit-row flex items-center gap-[4px] group rounded-xl p-1 transition-colors hover:bg-black/[0.02]"
              >
                {/* Habit name */}
                <div className="w-40 flex items-center gap-2 pr-4 min-w-[160px] flex-shrink-0">
                  <span className="font-medium text-sm text-gray-700 truncate flex-1">
                    {h.name}
                  </span>
                  <button
                    onClick={() => { playClick?.('switch'); onDeleteHabit(h.id); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-colors"
                    title="Delete habit"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Checkboxes */}
                {days.map(d => {
                  const completed = isCompleted(h.id, d);
                  const isToday = isCurrentMonth && d === currentDay;
                  return (
                    <motion.button
                      key={d}
                      onClick={() => handleToggle(h.id, d)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${completed
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-white border border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      {completed && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </motion.button>
                  );
                })}

                {/* Total */}
                <div className="w-14 text-center ml-2 text-xs font-bold text-gray-400">
                  {getTotal(h.id)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {habits.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center flex flex-col items-center justify-center opacity-50"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                ✨
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">
                Zero Habits
              </p>
              <p className="text-gray-400 text-sm">
                Time to build your routine
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitGrid;
