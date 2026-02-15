import { useState, useEffect, useRef } from 'react';

const TYPES = [
  { value: 'default', label: 'Default' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'gym', label: 'Gym' },
  { value: 'learning', label: 'Learn' },
];

const AddHabitModal = ({ isOpen, onClose, onAdd, playClick }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('default');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && name.trim()) handleAdd();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, name]);

  const handleAdd = () => {
    if (name.trim()) {
      playClick?.('toggle');
      onAdd(name.trim(), type);
      setName('');
      setType('default');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-te-bg border border-te-border p-6 w-full max-w-sm mx-4"
           style={{ borderRadius: '3px' }}>
        <h2 className="font-mono text-xs font-bold text-te-muted tracking-widest uppercase mb-4">
          New Habit
        </h2>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="habit name..."
          className="te-input mb-3"
        />

        {/* Type selector — button group */}
        <div className="flex mb-4">
          {TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => { playClick?.('switch'); setType(t.value); }}
              className={`type-btn ${type === t.value ? 'selected' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="te-btn flex-1">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="te-btn-primary flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;
