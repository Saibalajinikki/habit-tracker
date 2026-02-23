import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Flat Colors matching the reference
const COLORS = [
  'bg-[#ff3366]', // Hot Pink
  'bg-[#00d2ff]', // Bright Cyan
  'bg-[#ff2020]', // Deep Red
  'bg-[#00cc66]'  // Bright Green
];

// Gallery Data matching the reference aesthetic
const GALLERY_ITEMS = [
  { id: 'txt-1', type: 'text', content: "DONT BE\nAFRAID TO\nMAKE WAVES", subtext: 'AS LONG AS YOU DO IT FOR THE\nRIGHT REASONS', bgColor: COLORS[2], textColor: 'text-black' },
  { id: 'txt-2', type: 'text', content: "VIEW THE\nWORLD WITH A\nWIDE ANGLE\nLENS", subtext: 'THINK GLOBAL, ACT LOCAL', bgColor: COLORS[1], textColor: 'text-black' },
  { id: 'img-1', type: 'image', src: '/modern/meditate.png', label: 'FIND FOCUS' },
  { id: 'txt-3', type: 'text', content: "STAY\nCURIOUS", subtext: 'EXPLORE THE UNKNOWN\n\nCREATE SOMETHING NEW', bgColor: COLORS[0], textColor: 'text-white' },
  { id: 'img-2', type: 'image', src: '/modern/food.png', label: 'FUEL YOUR FIRE' },
  { id: 'img-3', type: 'image', src: '/modern/gym.png', label: 'STAY STRONG' },
  { id: 'img-4', type: 'image', src: '/modern/journal.png', label: 'REFLECT & GROW' },
  { id: 'img-5', type: 'image', src: '/modern/read.png', label: 'KEEP LEARNING' },
  { id: 'img-6', type: 'image', src: '/modern/run.png', label: 'MORNING RUN' },
  { id: 'img-7', type: 'image', src: '/modern/sleep.png', label: 'REST & RECOVER' },
  { id: 'img-8', type: 'image', src: '/modern/water.png', label: 'STAY HYDRATED' },
];

const INITIAL_POSITIONS = {
  'txt-1': { x: -150, y: -120, rotate: -15 },
  'txt-2': { x: 120, y: -80, rotate: 5 },
  'img-1': { x: -20, y: 10, rotate: 10 },
  'txt-3': { x: -80, y: 80, rotate: -20 },
  'img-2': { x: 80, y: 120, rotate: -10 },
  'img-3': { x: -250, y: 40, rotate: -5 },
  'img-4': { x: 180, y: 30, rotate: 15 },
  'img-5': { x: -50, y: -180, rotate: 8 },
  'img-6': { x: 80, y: -150, rotate: -12 },
  'img-7': { x: -140, y: 200, rotate: -8 },
  'img-8': { x: 200, y: -180, rotate: 20 },
};

const ScatterCard = ({ item, constraintsRef, isHovered, setHovered, bringToFront, zIndex, resetTrigger }) => {
  const [position, setPosition] = useState(INITIAL_POSITIONS[item.id] || { x: 0, y: 0, rotate: 0 });

  const randomizePosition = () => {
    const spreadX = window.innerWidth * 0.3;
    const spreadY = window.innerHeight * 0.3;
    setPosition({
      x: (Math.random() - 0.5) * spreadX * 2,
      y: (Math.random() - 0.5) * spreadY * 2,
      rotate: (Math.random() - 0.5) * 60,
    });
  };

  const resetPosition = () => {
    setPosition(INITIAL_POSITIONS[item.id] || { x: 0, y: 0, rotate: 0 });
  };

  useEffect(() => {
    const handleShuffle = () => randomizePosition();
    const handleReset = () => resetPosition();

    window.addEventListener('shuffleCards', handleShuffle);
    window.addEventListener('resetCards', handleReset);
    return () => {
      window.removeEventListener('shuffleCards', handleShuffle);
      window.removeEventListener('resetCards', handleReset);
    };
  }, []);

  // Also listen for rapid reset triggering via double click
  useEffect(() => {
    if (resetTrigger > 0) {
      resetPosition();
    }
  }, [resetTrigger]);

  const isImage = item.type === 'image';

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragStart={bringToFront}
      onMouseDown={bringToFront}
      onMouseEnter={() => setHovered(item.id)}
      onMouseLeave={() => setHovered(null)}
      initial={{ x: 0, y: window.innerHeight, opacity: 0, rotate: 0 }}
      animate={{
        x: position.x,
        y: position.y,
        rotate: position.rotate,
        opacity: 1,
        scale: 1,
        zIndex: zIndex
      }}
      whileHover={{ scale: 1.05, zIndex: 999 }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 1000 }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 1,
        layout: { duration: 0.3 }
      }}
      className={`absolute cursor-grab ${item.bgColor || 'bg-[#fcfcfc]'} shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-4 transition-shadow ${isHovered === item.id ? 'shadow-[0_20px_50px_rgba(0,0,0,0.7)]' : ''
        }`}
      style={{
        width: 300,
        height: 380,
        touchAction: 'none'
      }}
    >
      {isImage ? (
        <>
          <div className="w-full mb-3 flex-1 relative bg-black overflow-hidden object-cover select-none pointer-events-none">
            <img
              src={item.src}
              alt={item.label}
              className="w-full h-full object-cover"
              draggable={false}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <span className="font-sans font-bold text-xs text-gray-400 tracking-widest uppercase w-full text-left pl-1">
            {item.label}
          </span>
        </>
      ) : (
        <div className={`flex flex-col h-full w-full pointer-events-none p-2 ${item.textColor || 'text-black'}`}>
          <h3 className="text-4xl font-black tracking-tighter leading-[0.9] whitespace-pre-line mt-2 text-left w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            {item.content}
          </h3>
          <div className="mt-auto w-full text-left">
            <p className="text-[10px] font-bold tracking-widest opacity-80 uppercase whitespace-pre-line" style={{ fontFamily: 'Inter, sans-serif' }}>
              {item.subtext}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const LoginScreen = ({ onSignIn }) => {
  const containerRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [topIndex, setTopIndex] = useState(10);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [cardZIndices, setCardZIndices] = useState(
    GALLERY_ITEMS.reduce((acc, item, i) => ({ ...acc, [item.id]: i }), {})
  );

  const bringToFront = (id) => {
    setTopIndex((prev) => prev + 1);
    setCardZIndices((prev) => ({ ...prev, [id]: topIndex + 1 }));
  };

  const throwCards = () => {
    window.dispatchEvent(new Event('shuffleCards'));
  };

  const resetCards = () => {
    setResetTrigger(prev => prev + 1);
    window.dispatchEvent(new Event('resetCards'));
  };

  return (
    <div
      ref={containerRef}
      onDoubleClick={resetCards}
      className="relative w-screen h-screen overflow-hidden bg-[#0A0A0A] flex flex-col"
    >
      {/* --- Safe Zone for background double-click detection (transparent shield) --- */}
      <div className="absolute inset-0 z-0 bg-transparent" />

      {/* --- Background Layer --- */}
      {/* Giant Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10">
        <h1
          className="text-[28vw] font-black text-white selection:bg-transparent tracking-tighter leading-none whitespace-nowrap"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          H<span className="opacity-90">A</span><span className="opacity-100">B</span>IT
        </h1>
      </div>

      {/* Header Log In (Top Center or standard) */}
      <div className="absolute top-8 w-full flex justify-center z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="pointer-events-auto"
        >
          <button
            onClick={onSignIn}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.053-1.147 8.213-3.307C22.96 18.52 23.68 15.52 23.68 13.093c0-.773-.067-1.293-.187-1.293h-11.013z" />
            </svg>
            Sign In To Access
          </button>
        </motion.div>
      </div>

      {/* --- Scatter Gallery Layer --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="relative w-full h-full max-w-7xl pointer-events-auto overflow-visible flex items-center justify-center">
          {GALLERY_ITEMS.map((item) => (
            <ScatterCard
              key={item.id}
              item={item}
              constraintsRef={containerRef}
              isHovered={hoveredCard}
              setHovered={setHoveredCard}
              bringToFront={() => bringToFront(item.id)}
              zIndex={cardZIndices[item.id]}
              resetTrigger={resetTrigger}
            />
          ))}
        </div>
      </div>

      {/* --- UI Footer Layer --- */}
      <div className="absolute bottom-8 left-8 right-8 z-[100] flex justify-between items-end pointer-events-none select-none">

        {/* Helper Text */}
        <p className="font-sans text-xs text-white/40 tracking-wide pointer-events-auto">
          Drag items to rearrange &bull; Double click to reset
        </p>

        {/* Scatter Button Pill */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent double click reset
            throwCards();
          }}
          className="bg-white text-black px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.2)] font-bold text-xs tracking-widest uppercase flex items-center gap-2 pointer-events-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Scatter
        </motion.button>

      </div>

    </div>
  );
};

export default LoginScreen;
