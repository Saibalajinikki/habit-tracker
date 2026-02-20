import { motion } from 'framer-motion';
import VUMeter from './VUMeter';

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS_MINI = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      {/* ── Section Label ── */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Habit Analytics</span>
        <div className="flex-1 h-[1px] bg-gray-100" />
      </div>

      {/* ── Per-Habit Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((h, i) => {
          const rate = getHabitRate(h.id);
          const streak = getHabitStreak(h.id);
          const total = getTotal(h.id);
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.06 }}
              className="modern-card p-5 hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm text-gray-900 uppercase tracking-tight">
                  {h.name}
                </span>
                <span className="text-2xl font-black text-gray-900">
                  {rate}<span className="text-sm text-gray-400 font-medium ml-0.5">%</span>
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rate}%` }}
                  className="h-full bg-black rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                <div className="flex gap-2">
                  <span>Cur: <strong className="text-gray-900">{streak.current}d</strong></span>
                </div>
                <div>
                  <span>Best: <strong className="text-gray-900">{streak.best}d</strong></span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom Row: Weekly Pattern + Yearly Overview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="modern-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Weekly Pattern</span>
          </div>
          <div className="flex flex-col gap-3">
            {DOW.map((day, i) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 w-8">{day}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-black"
                    initial={{ width: 0 }}
                    animate={{ width: `${weekdayPattern[i]}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                    style={{ opacity: weekdayPattern[i] / 100 + 0.2 }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-900 w-8 text-right">
                  {weekdayPattern[i]}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Yearly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="modern-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{selectedYear} Overview</span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {MONTHS_MINI.map((m, i) => {
              const pct = yearlyOverview[i];
              const isCurrent = i === selectedMonth;
              return (
                <div key={m} className="flex flex-col items-center gap-2">
                  <div className="w-full h-16 relative bg-gray-50 rounded-lg overflow-hidden flex items-end">
                    <motion.div
                      className={`w-full ${isCurrent ? 'bg-black' : 'bg-gray-300'}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: 0.9 + i * 0.04 }}
                    />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isCurrent ? 'text-black' : 'text-gray-300'}`}>
                    {m}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel;
