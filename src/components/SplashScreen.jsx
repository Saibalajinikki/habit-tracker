import { useState, useRef, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setPlaying(true))
        .catch(() => setNeedsTap(true));
    }
  }, []);

  const handleVideoEnd = () => {
    setFadeOut(true);
    setTimeout(onComplete, 500);
  };

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (needsTap && !playing) {
      // First tap — start the video
      video.play().then(() => {
        setPlaying(true);
        setNeedsTap(false);
      });
    } else if (playing) {
      // Already playing — skip
      video.pause();
      handleVideoEnd();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#141414] flex items-center justify-center cursor-pointer transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        controls={false}
        onEnded={handleVideoEnd}
        className="w-full h-full object-contain"
        style={{ pointerEvents: 'none' }}
      >
        <source src="/habitflow-intro.webm" type="video/webm" />
        <source src="/habitflow-intro.mp4" type="video/mp4" />
      </video>

      <span className="absolute bottom-8 font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase">
        {needsTap ? 'Tap to play' : 'Click to skip'}
      </span>
    </div>
  );
};

export default SplashScreen;
