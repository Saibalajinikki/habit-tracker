import { useState, useEffect, useCallback } from 'react';
import {
  initDB, getHabits, addHabit, deleteHabit,
  getEntriesForMonth, getAllCompletedEntries, toggleHabitEntry,
} from '../utils/database';

const formatDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const useHabitTracker = (year, month, userId) => {
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState({});
  const [allCompleted, setAllCompleted] = useState(new Map()); // habitId -> Set of "YYYY-MM-DD"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const currentDay = today.getFullYear() === year && today.getMonth() === month
    ? Math.min(today.getDate(), daysInMonth) : daysInMonth;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) return;
      await initDB(userId);

      const habitsData = await getHabits();
      setHabits(habitsData);

      const entriesData = await getEntriesForMonth(year, month);
      const entriesMap = {};
      entriesData.forEach(entry => {
        if (!entriesMap[entry.habit_id]) entriesMap[entry.habit_id] = {};
        entriesMap[entry.habit_id][entry.day] = entry.completed ? 1 : 0;
      });
      setEntries(entriesMap);

      // Load all-time completed entries for streak calculation
      const allData = await getAllCompletedEntries();
      const map = new Map();
      allData.forEach(e => {
        if (!map.has(e.habit_id)) map.set(e.habit_id, new Set());
        map.get(e.habit_id).add(`${e.year}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')}`);
      });
      setAllCompleted(map);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [year, month, userId]);

  useEffect(() => { loadData(); }, [loadData]);

  const createHabit = async (name, type = 'default') => {
    try { await addHabit(name, type); await loadData(); }
    catch (err) { setError(err.message); }
  };

  const removeHabit = async (habitId) => {
    try { await deleteHabit(habitId); await loadData(); }
    catch (err) { setError(err.message); }
  };

  const toggleDay = async (habitId, day) => {
    // Optimistic UI update first — instant feedback
    setEntries(prev => {
      const n = { ...prev };
      n[habitId] = { ...(n[habitId] || {}) };
      n[habitId][day] = n[habitId][day] ? 0 : 1;
      return n;
    });
    setAllCompleted(prev => {
      const next = new Map(prev);
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (!next.has(habitId)) next.set(habitId, new Set());
      const set = new Set(next.get(habitId));
      if (set.has(dateStr)) set.delete(dateStr);
      else set.add(dateStr);
      next.set(habitId, set);
      return next;
    });

    // Persist to database in background
    try {
      await toggleHabitEntry(habitId, year, month, day);
    } catch (err) {
      // Rollback on error by reloading from DB
      setError(err.message);
      await loadData();
    }
  };

  const isCompleted = (habitId, day) => entries[habitId]?.[day] === 1;

  const getTotal = (habitId) => {
    const he = entries[habitId];
    if (!he) return 0;
    return Object.values(he).filter(v => v === 1).length;
  };

  const isPerfectDay = (day) => {
    if (habits.length === 0) return false;
    return habits.every(h => isCompleted(h.id, day));
  };

  // Real consecutive-day streak for a single habit
  const getHabitStreak = (habitId) => {
    const dates = allCompleted.get(habitId);
    if (!dates || dates.size === 0) return { current: 0, best: 0 };

    let current = 0;
    let best = 0;
    let streak = 0;
    const d = new Date();

    // If today isn't completed, start checking from yesterday
    if (!dates.has(formatDate(d))) d.setDate(d.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      if (dates.has(formatDate(d))) {
        streak++;
      } else {
        best = Math.max(best, streak);
        if (current === 0) current = streak;
        streak = 0;
      }
      d.setDate(d.getDate() - 1);
    }
    best = Math.max(best, streak);
    if (current === 0) current = streak;

    return { current, best };
  };

  // Overall streak: consecutive days where ALL habits are done
  const getOverallStreak = () => {
    if (habits.length === 0) return { current: 0, best: 0 };

    let current = 0;
    let best = 0;
    let streak = 0;
    const d = new Date();

    const allDone = (dateStr) => habits.every(h => {
      const dates = allCompleted.get(h.id);
      return dates && dates.has(dateStr);
    });

    if (!allDone(formatDate(d))) d.setDate(d.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      if (allDone(formatDate(d))) {
        streak++;
      } else {
        best = Math.max(best, streak);
        if (current === 0) current = streak;
        streak = 0;
      }
      d.setDate(d.getDate() - 1);
    }
    best = Math.max(best, streak);
    if (current === 0) current = streak;

    return { current, best };
  };

  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const totalPossible = habits.length * currentDay;
    const totalDone = habits.reduce((sum, h) => sum + getTotal(h.id), 0);
    return totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
  };

  const getPerfectDayCount = () => {
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      if (isPerfectDay(d)) count++;
    }
    return count;
  };

  const getTotalCompleted = () => habits.reduce((sum, h) => sum + getTotal(h.id), 0);

  // Per-habit completion rate for current month
  const getHabitRate = (habitId) => {
    if (currentDay === 0) return 0;
    return Math.round((getTotal(habitId) / currentDay) * 100);
  };

  // Weekday pattern: completion rate per day-of-week for current month
  const getWeekdayPattern = () => {
    const counts = Array(7).fill(0);
    const totals = Array(7).fill(0);
    for (let d = 1; d <= currentDay; d++) {
      const dow = new Date(year, month, d).getDay();
      totals[dow]++;
      if (isPerfectDay(d)) counts[dow]++;
      else {
        // Count partial: fraction of habits done
        const done = habits.filter(h => isCompleted(h.id, d)).length;
        if (habits.length > 0) counts[dow] += done / habits.length;
      }
    }
    return totals.map((t, i) => t > 0 ? Math.round((counts[i] / t) * 100) : 0);
  };

  // Yearly overview: completion % per month for selectedYear
  const getYearlyOverview = () => {
    return Array.from({ length: 12 }, (_, m) => {
      let done = 0;
      let possible = 0;
      const dim = new Date(year, m + 1, 0).getDate();
      const maxDay = (year === today.getFullYear() && m === today.getMonth())
        ? Math.min(today.getDate(), dim)
        : (year < today.getFullYear() || (year === today.getFullYear() && m < today.getMonth()))
          ? dim : 0;
      if (maxDay === 0 || habits.length === 0) return 0;
      habits.forEach(h => {
        const dates = allCompleted.get(h.id);
        if (!dates) return;
        for (let d = 1; d <= maxDay; d++) {
          possible++;
          const ds = `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          if (dates.has(ds)) done++;
        }
      });
      return possible > 0 ? Math.round((done / possible) * 100) : 0;
    });
  };

  return {
    habits, entries, loading, error,
    createHabit, removeHabit, toggleDay,
    isCompleted, getTotal, isPerfectDay,
    getHabitStreak, getOverallStreak,
    getCompletionRate, getPerfectDayCount, getTotalCompleted,
    getHabitRate, getWeekdayPattern, getYearlyOverview,
    daysInMonth, currentDay,
    refresh: loadData,
  };
};
