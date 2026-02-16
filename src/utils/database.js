import { db } from './firebase';
import {
  collection, doc, addDoc, getDocs, query,
  where, orderBy, writeBatch, updateDoc, getDoc, setDoc,
} from 'firebase/firestore';

let userId = null;

const habitsCol = () => collection(db, 'users', userId, 'habits');
const entriesCol = () => collection(db, 'users', userId, 'entries');

export const initDB = async (uid) => {
  userId = uid;
};

export const getHabits = async () => {
  const q = query(habitsCol(), orderBy('sort_order'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addHabit = async (name, type = 'default') => {
  // Get max sort_order
  const q = query(habitsCol(), orderBy('sort_order', 'desc'));
  const snap = await getDocs(q);
  const maxOrder = snap.docs.length > 0 ? (snap.docs[0].data().sort_order || 0) : 0;

  const docRef = await addDoc(habitsCol(), {
    name,
    type,
    sort_order: maxOrder + 1,
    created_at: new Date().toISOString(),
  });
  return docRef.id;
};

export const deleteHabit = async (habitId) => {
  // Delete all entries for this habit
  const q = query(entriesCol(), where('habit_id', '==', habitId));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  // Delete the habit itself
  batch.delete(doc(habitsCol(), habitId));
  await batch.commit();
};

export const getEntriesForMonth = async (year, month) => {
  const q = query(
    entriesCol(),
    where('year', '==', year),
    where('month', '==', month)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllCompletedEntries = async () => {
  const q = query(entriesCol(), where('completed', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return { habit_id: data.habit_id, year: data.year, month: data.month, day: data.day };
  });
};

export const toggleHabitEntry = async (habitId, year, month, day) => {
  // Use a deterministic doc ID so we can find/update without querying
  const entryId = `${habitId}_${year}_${month}_${day}`;
  const entryRef = doc(entriesCol(), entryId);
  const snap = await getDoc(entryRef);

  if (snap.exists()) {
    const current = snap.data().completed;
    await updateDoc(entryRef, { completed: !current });
  } else {
    await setDoc(entryRef, {
      habit_id: habitId,
      year,
      month,
      day,
      completed: true,
    });
  }
};
