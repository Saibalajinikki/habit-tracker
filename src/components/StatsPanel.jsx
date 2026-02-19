import { motion } from 'framer-motion';

const StatsPanel = ({ totalCompleted, completionRate, currentStreak, perfectDays }) => {
  const stats = [
    { value: totalCompleted, label: 'completed', icon: '✓' },
    { value: `${completionRate}%`, label: 'rate', icon: '◉' },
    { value: currentStreak, label: 'streak', icon: '⟳' },
    { value: perfectDays, label: 'perfect', icon: '★' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex items-center justify-center gap-6 sm:gap-10 py-4 px-6 relative z-10"
      style={{
        borderTop: '1px solid rgba(0,0,0,0.06)',
        background: 'rgba(250, 250, 248, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + i * 0.08 }}
        >
          <span style={{
            fontSize: '12px',
            color: '#888',
          }}>{s.icon}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            fontWeight: 700,
            color: '#1A1A1A',
          }}>{s.value}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#AAA',
          }}>{s.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsPanel;
