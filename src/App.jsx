import { useState, useEffect } from 'react';
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

const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function App() {
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
  } = useHabitTracker(selectedYear, selectedMonth);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-te-bg">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-te-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-te-muted mt-3 uppercase tracking-widest">Initializing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-te-bg">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-te-border">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg font-bold text-te-text tracking-tight">
            HABITFLOW
          </h1>
          <div className="w-1.5 h-1.5 rounded-full" style={{
            background: theme.accent,
            boxShadow: `0 0 6px ${theme.accent}99`,
          }} />
        </div>

        <span className="font-mono text-[10px] text-te-muted tracking-widest uppercase hidden sm:block">
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
            className={`hw-toggle ${soundEnabled ? 'active' : ''}`}
            title="Toggle sound"
          >
            <div className="pill" />
          </button>
          <span className="font-mono text-[9px] text-te-muted uppercase hidden sm:inline">Sound</span>

          {/* Dark mode toggle */}
          <button
            onClick={() => { toggleDark(); playClick('switch'); }}
            className={`hw-toggle ${dark ? 'active' : ''}`}
            title="Toggle dark mode (D)"
          >
            <div className="pill" />
          </button>
          <span className="font-mono text-[9px] text-te-muted uppercase hidden sm:inline">Dark</span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-6 overflow-auto">
        {/* Left Panel — Knob + Stats */}
        <div className="flex flex-col items-center gap-6 lg:w-[240px] flex-shrink-0">
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
            <span className="font-mono text-[9px] text-te-muted uppercase tracking-wider">Best</span>
            <span className="font-mono text-sm font-bold text-te-text tabular-nums">
              {overallStreak.best}d
            </span>
          </div>

          {/* Completion VU meter */}
          <div className="w-full max-w-[180px]">
            <VUMeter value={completionRate} label="Completion" />
          </div>
        </div>

        {/* Right Panel — Grid + Analytics */}
        <div className="flex-1 min-w-0">
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
        </div>
      </main>

      {/* ── Footer Stats ── */}
      <StatsPanel
        totalCompleted={totalCompleted}
        completionRate={completionRate}
        currentStreak={overallStreak.current}
        perfectDays={perfectDays}
      />

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
