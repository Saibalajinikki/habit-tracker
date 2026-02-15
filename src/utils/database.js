import initSqlJs from 'sql.js';

let db = null;
let dbReady = null;

export const initDB = async () => {
  if (dbReady) return dbReady;

  dbReady = (async () => {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    const savedDb = localStorage.getItem('habitTrackerDB');
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'default',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        sort_order INTEGER DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS habit_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        day INTEGER NOT NULL,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
        UNIQUE(habit_id, year, month, day)
      )
    `);

    try { db.exec("SELECT type FROM habits LIMIT 1"); }
    catch { db.run("ALTER TABLE habits ADD COLUMN type TEXT DEFAULT 'default'"); }

    saveDB();
    return db;
  })();

  return dbReady;
};

export const saveDB = () => {
  if (!db) return;
  const data = db.export();
  localStorage.setItem('habitTrackerDB', JSON.stringify(Array.from(data)));
};

const parseRows = (result) => {
  if (result.length === 0) return [];
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
};

export const getHabits = async () => {
  await initDB();
  return parseRows(db.exec('SELECT * FROM habits ORDER BY sort_order, id'));
};

export const addHabit = async (name, type = 'default') => {
  await initDB();
  const maxOrder = db.exec('SELECT MAX(sort_order) as max FROM habits');
  const nextOrder = (maxOrder[0]?.values[0]?.[0] || 0) + 1;
  db.run('INSERT INTO habits (name, type, sort_order) VALUES (?, ?, ?)', [name, type, nextOrder]);
  saveDB();
  return db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
};

export const deleteHabit = async (habitId) => {
  await initDB();
  db.run('DELETE FROM habit_entries WHERE habit_id = ?', [habitId]);
  db.run('DELETE FROM habits WHERE id = ?', [habitId]);
  saveDB();
};

export const getEntriesForMonth = async (year, month) => {
  await initDB();
  return parseRows(db.exec(
    'SELECT * FROM habit_entries WHERE year = ? AND month = ?',
    [year, month]
  ));
};

export const getAllCompletedEntries = async () => {
  await initDB();
  return parseRows(db.exec(
    'SELECT habit_id, year, month, day FROM habit_entries WHERE completed = 1 ORDER BY year DESC, month DESC, day DESC'
  ));
};

export const toggleHabitEntry = async (habitId, year, month, day) => {
  await initDB();
  const existing = db.exec(
    'SELECT completed FROM habit_entries WHERE habit_id = ? AND year = ? AND month = ? AND day = ?',
    [habitId, year, month, day]
  );
  if (existing.length > 0 && existing[0].values.length > 0) {
    const currentValue = existing[0].values[0][0];
    db.run(
      'UPDATE habit_entries SET completed = ? WHERE habit_id = ? AND year = ? AND month = ? AND day = ?',
      [currentValue ? 0 : 1, habitId, year, month, day]
    );
  } else {
    db.run(
      'INSERT INTO habit_entries (habit_id, year, month, day, completed) VALUES (?, ?, ?, ?, 1)',
      [habitId, year, month, day]
    );
  }
  saveDB();
};
