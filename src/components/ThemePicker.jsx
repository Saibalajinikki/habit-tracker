import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemePicker = ({ themes, currentThemeId, onSelect, playClick }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', handle);
      return () => document.removeEventListener('mousedown', handle);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      document.addEventListener('keydown', handle);
      return () => document.removeEventListener('keydown', handle);
    }
  }, [open]);

  const current = themes.find(t => t.id === currentThemeId) || themes[0];

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <motion.button
        onClick={() => { setOpen(!open); playClick?.('switch'); }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
        title="Change color scheme"
      >
        <div
          className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10"
          style={{ background: current.accent }}
        />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden sm:inline">Theme</span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 top-full mt-2 z-[100] min-w-[260px] modern-card p-4"
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Color Scheme</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t, i) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => {
                    playClick?.('toggle');
                    onSelect(t.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${t.id === currentThemeId ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/20"
                    style={{ background: t.accent }}
                  />
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold leading-tight truncate">
                      {t.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemePicker;
