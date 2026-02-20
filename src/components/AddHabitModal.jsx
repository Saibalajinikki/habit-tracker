import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPES = [
  { value: 'default', label: 'Default', icon: '📝' },
  { value: 'gym', label: 'Gym', icon: '💪' },
  { value: 'running', label: 'Run', icon: '🏃' },
  { value: 'coffee', label: 'Coffee', icon: '☕' },
  { value: 'learning', label: 'Learn', icon: '📚' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'cooking', label: 'Cook', icon: '🍳' },
  { value: 'creative', label: 'Create', icon: '✨' },
];

const AddHabitModal = ({ isOpen, onClose, onAdd, playClick }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('default');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center z-[200] bg-black/20 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="modern-card p-6 w-full max-w-md mx-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                New Habit
              </h2>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What do you want to track?"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 mb-6"
            />

            {/* Category selector */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Category</span>
              <div className="grid grid-cols-4 gap-2">
                {TYPES.map(t => (
                  <motion.button
                    key={t.value}
                    onClick={() => { playClick?.('switch'); setType(t.value); }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${type === t.value ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      {t.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!name.trim()}
                className="flex-1 py-3 rounded-full font-bold text-xs uppercase tracking-wider bg-black text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Habit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddHabitModal;
