import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { useHabitTracker } from './hooks/useHabitTracker';
import { useClickSound } from './hooks/useClickSound';
import { useDarkMode } from './hooks/useDarkMode';
import { useTheme } from './hooks/useTheme';
import MonthKnob from './components/MonthKnob';
import HabitGrid from './components/HabitGrid';
import AddHabitModal from './components/AddHabitModal';
import FlipCounter from './components/FlipCounter';
import VUMeter from './components/VUMeter';
import StatsPanel from './components/StatsPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import ThemePicker from './components/ThemePicker';
import LoginScreen from './components/LoginScreen';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const GREETINGS = [
  "Let's build something great today.",
  "Every rep counts. Every habit matters.",
  "Consistency is the secret ingredient.",
  "Cook up some discipline today.",
  "Run the day, don't let it run you.",
  "Create, build, repeat.",
];

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function App() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [showAddModal, setShowAddModal] = useState(false);

  const { playClick, enabled: soundEnabled, toggle: toggleSound } = useClickSound();
  const { dark, toggle: toggleDark } = useDarkMode();
  const { theme, themeId, setTheme, themes } = useTheme();

  const {
    habits,
    loading,
    createHabit,
    removeHabit,
    toggleDay,
    isCompleted,
    getTotal,
    isPerfectDay,
    getHabitStreak,
    getOverallStreak,
    getCompletionRate,
    getPerfectDayCount,
    getTotalCompleted,
    getHabitRate,
    getWeekdayPattern,
    getYearlyOverview,
    daysInMonth,
  } = useHabitTracker(selectedYear, selectedMonth, user?.uid);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (showAddModal) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedMonth(m => {
          if (m === 0) { setSelectedYear(y => y - 1); return 11; }
          return m - 1;
        });
        playClick('knob');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedMonth(m => {
          if (m === 11) { setSelectedYear(y => y + 1); return 0; }
          return m + 1;
        });
        playClick('knob');
      }
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        setShowAddModal(true);
      }
      if (e.key === 'd' && !e.metaKey && !e.ctrlKey) {
        toggleDark();
        playClick('switch');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showAddModal, playClick, toggleDark]);

  const overallStreak = getOverallStreak();
  const completionRate = getCompletionRate();
  const perfectDays = getPerfectDayCount();
  const totalCompleted = getTotalCompleted();
  const weekdayPattern = getWeekdayPattern();
  const yearlyOverview = getYearlyOverview();

  const dateStr = `${DAYS[today.getDay()]} · ${MONTHS_SHORT[today.getMonth()]} ${today.getDate()} · ${today.getFullYear()}`;
  const greeting = getTimeGreeting();
  const [motd] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-bg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 rounded-full mx-auto mb-3"
            style={{
              border: '2px solid #1A1A1A',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p className="font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: '#999' }}>Initializing</p>
        </motion.div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onSignIn={signIn} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-bg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 rounded-full mx-auto mb-3"
            style={{
              border: '2px solid #1A1A1A',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p className="font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: '#999' }}>Loading habits</p>
        </motion.div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const firstName = user.displayName?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen flex flex-col relative bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      {/* ── Header — Modern Minimal ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center justify-between px-6 py-4 z-20 bg-white/50 backdrop-blur-md sticky top-0 border-b border-black/5"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-black">
            HABIT<span className="text-gray-400 font-medium">FLOW</span>
          </h1>
        </div>

        <span className="absolute left-1/2 -translate-x-1/2 hidden sm:block text-xs font-medium tracking-widest text-gray-400 uppercase">
          {dateStr}
        </span>

        <div className="flex items-center gap-3">
          {/* Theme picker */}
          <ThemePicker
            themes={themes}
            currentThemeId={themeId}
            onSelect={setTheme}
            playClick={playClick}
          />

          {/* Sound toggle */}
          <button
            onClick={() => { toggleSound(); playClick('switch'); }}
            className="px-3 py-1.5 rounded-full bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
            style={{ color: soundEnabled ? '#1A1A1A' : '#BBB' }}
            title="Toggle sound"
          >
            {soundEnabled ? '♪ On' : '♪ Off'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => { toggleDark(); playClick('switch'); }}
            className="px-3 py-1.5 rounded-full bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
            style={{ color: dark ? '#1A1A1A' : '#BBB' }}
            title="Toggle dark mode (D)"
          >
            {dark ? '● Dark' : '○ Light'}
          </button>

          {/* Logout */}
          <button
            onClick={() => { playClick?.('switch'); signOut(); }}
            className="px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            title="Sign out"
          >
            Logout
          </button>
        </div>
      </motion.header>

      {/* ── Greeting Section — Clean ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="px-6 pt-8 pb-4 z-10 max-w-7xl mx-auto w-full"
      >
        <h2 className="text-4xl font-light text-gray-400 tracking-tight">
          {greeting}, <span className="font-bold text-black">{firstName}</span>
        </h2>
        <p className="text-sm font-medium text-gray-400 mt-1">
          {motd}
        </p>
      </motion.div>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-auto max-w-7xl mx-auto w-full">
        {/* Left Panel — Knob + Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col gap-5 lg:w-[280px] flex-shrink-0"
        >
          <div className="modern-card p-6 flex flex-col items-center gap-6">
            <MonthKnob
              month={selectedMonth}
              year={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
              playClick={playClick}
            />

            {/* Streak counter */}
            <FlipCounter
              value={overallStreak.current}
              digits={3}
              label="Day Streak"
            />

            {/* Best streak */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Best</span>
              <span className="text-sm font-bold text-black">
                {overallStreak.best}d
              </span>
            </div>

            {/* Completion VU meter */}
            <div className="w-full max-w-[200px]">
              <VUMeter value={completionRate} label="Completion" />
            </div>
          </div>

          {/* Quick stats bento — modern card style */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {[
              { value: totalCompleted, label: 'Done', icon: '✓' },
              { value: `${completionRate}%`, label: 'Rate', icon: '◉' },
              { value: overallStreak.current, label: 'Streak', icon: '⟳' },
              { value: perfectDays, label: 'Perfect', icon: '★' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="modern-card text-center py-5 flex flex-col items-center justify-center gap-1 hover:scale-[1.02] transition-transform"
              >
                <span className="text-lg text-black">{stat.icon}</span>
                <span className="text-xl font-bold text-black tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel — Grid + Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex-1 min-w-0 flex flex-col gap-6"
        >
          <div className="modern-card p-6 min-h-[400px]">
            <HabitGrid
              habits={habits}
              year={selectedYear}
              month={selectedMonth}
              isCompleted={isCompleted}
              getTotal={getTotal}
              isPerfectDay={isPerfectDay}
              onToggle={toggleDay}
              onDeleteHabit={removeHabit}
              onOpenAddModal={() => setShowAddModal(true)}
              playClick={playClick}
            />
          </div>

          {/* Analytics */}
          <AnalyticsPanel
            habits={habits}
            getHabitRate={getHabitRate}
            getHabitStreak={getHabitStreak}
            getTotal={getTotal}
            daysInMonth={daysInMonth}
            weekdayPattern={weekdayPattern}
            yearlyOverview={yearlyOverview}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </motion.div>
      </main>

      {/* ── Add Modal ── */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={createHabit}
        playClick={playClick}
      />
    </div>
  );
}

export default App;
