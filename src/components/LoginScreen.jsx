import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HABIT_IMAGES = [
  { id: 'run', src: '/modern/run.png', alt: 'Running', x: '-150%', y: '-150%', r: -15 },     // Top Left
  { id: 'food', src: '/modern/food.png', alt: 'Healthy Food', x: '150%', y: '-150%', r: 15 }, // Top Right
  { id: 'gym', src: '/modern/gym.png', alt: 'Gym', x: '-150%', y: '150%', r: 10 },       // Bottom Left
  { id: 'read', src: '/modern/read.png', alt: 'Reading', x: '150%', y: '150%', r: -10 },      // Bottom Right
  { id: 'meditate', src: '/modern/meditate.png', alt: 'Meditation', x: '0%', y: '-170%', r: 0 },  // Top Center
  { id: 'journal', src: '/modern/journal.png', alt: 'Journaling', x: '0%', y: '170%', r: 0 },     // Bottom Center
  { id: 'water', src: '/modern/water.png', alt: 'Hydration', x: '-190%', y: '0%', r: -5 },    // Left Center
  { id: 'sleep', src: '/modern/sleep.png', alt: 'Sleep', x: '190%', y: '0%', r: 5 },        // Right Center
];

const LoginScreen = ({ onSignIn }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="h-screen w-screen overflow-hidden relative flex items-center justify-center bg-[#F2F2F2]"
      onClick={() => setExpanded(true)}
    >
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
              HabitFlow
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cluster */}
      <div className="relative w-full h-full max-w-4xl max-h-4xl flex items-center justify-center">
        {HABIT_IMAGES.map((img, i) => {
          // Initial: Center cluster, slightly offset/rotated
          // Expanded: Move to specific x/y
          const initialX = (Math.random() - 0.5) * 50;
          const initialY = (Math.random() - 0.5) * 50;
          const initialR = (Math.random() - 0.5) * 15;

          return (
            <motion.div
              key={img.id}
              className="absolute shadow-2xl rounded-2xl overflow-hidden cursor-pointer"
              style={{
                width: '260px',
                height: '260px',
                zIndex: expanded ? 0 : 10 - i, // Inverse z-index to stack nicely
              }}
              initial={{ x: initialX, y: initialY, rotate: initialR, scale: 0.8 }}
              animate={expanded ? {
                x: img.x, // Move to edge position (custom css needed or calc)
                y: img.y,
                rotate: img.r,
                scale: 1,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              } : {
                x: initialX,
                y: initialY,
                rotate: initialR,
                scale: 1, // Slight hover effect maybe?
                transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } // Breathing effect
              }}
              whileHover={!expanded ? { scale: 1.05, zIndex: 20 } : {}}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/200x200/EEE/31343C?text=' + img.alt;
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Login Button - Revealed on expand */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'backOut' }}
            className="absolute z-50"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSignIn();
              }}
              className="bg-black text-white px-8 py-3 rounded-full font-medium text-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.053-1.147 8.213-3.307C22.96 18.52 23.68 15.52 23.68 13.093c0-.773-.067-1.293-.187-1.293h-11.013z" />
              </svg>
              Sign in with Google
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Text */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-10 text-gray-500 text-sm font-medium tracking-wider uppercase pointer-events-none"
          >
            Tap to start
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginScreen;
