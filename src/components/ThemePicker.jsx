import { useState, useRef, useEffect } from 'react';

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
      {/* Trigger button — shows current accent color */}
      <button
        onClick={() => { setOpen(!open); playClick?.('switch'); }}
        className="flex items-center gap-2 te-btn px-3 py-1.5"
        title="Change color scheme"
      >
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: current.accent, boxShadow: `0 0 6px ${current.accent}60` }}
        />
        <span className="hidden sm:inline text-[9px]">Themes</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 border border-te-border bg-te-bg p-3 z-[100] min-w-[220px]"
          style={{ borderRadius: '3px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        >
          <span className="font-mono text-[8px] text-te-muted uppercase tracking-widest block mb-2">
            Color Scheme
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  playClick?.('toggle');
                  onSelect(t.id);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-sm transition-all text-left ${
                  t.id === currentThemeId
                    ? 'border border-current bg-te-surface'
                    : 'border border-transparent hover:bg-te-surface'
                }`}
                style={t.id === currentThemeId ? { borderColor: t.accent } : undefined}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    background: t.accent,
                    boxShadow: t.id === currentThemeId ? `0 0 8px ${t.accent}80` : 'none',
                  }}
                />
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold text-te-text block leading-tight truncate">
                    {t.name}
                  </span>
                  <span className="font-mono text-[8px] text-te-muted block leading-tight truncate">
                    {t.product}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
