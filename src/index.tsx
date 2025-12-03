import React, { useState, useEffect, useRef } from "react";
import { useWidgetContext, ui } from "dailie-widget-sdk";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function Widget() {
  const { context } = useWidgetContext();

  // State
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5);

  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Timer Logic (High Precision)
  useEffect(() => {
    if (isActive) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      const tick = () => {
        if (!endTimeRef.current) return;
        const now = Date.now();
        const remaining = Math.max(0, (endTimeRef.current - now) / 1000);

        setTimeLeft(remaining);

        if (remaining <= 0) {
          setIsActive(false);
          endTimeRef.current = null;
          ui.alert("Time's up!");
        } else {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      endTimeRef.current = null;
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isActive]);

  // Reset when duration changes
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
    }
  }, [duration]);

  if (!context) return <div className="p-4 text-white/50">Loading...</div>;

  const { gridSize } = context;
  const isSmall = gridSize === "1x1";
  const isTall = gridSize === "1x2";

  // Layout Helpers
  const isHorizontalLayout = gridSize === "2x1" || gridSize === "3x2";
  const showSlider = !isSmall && !isTall;
  const showDecimals = !isSmall && !isTall && gridSize !== "2x1";

  const handleToggle = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration);
    endTimeRef.current = null;
  };

  // Format time
  const formattedTime = showDecimals
    ? timeLeft.toFixed(1)
    : Math.ceil(timeLeft).toString();

  // Dynamic Styles based on size
  let containerClass = "flex-col gap-4";
  let fontSizeClass = "text-7xl";
  let timerMinWidth = "";

  if (isSmall) {
    fontSizeClass = "text-4xl";
  } else if (isTall) {
    // 1x2: Vertical, smaller font than full size
    fontSizeClass = "text-5xl";
    containerClass = "flex-col gap-6";
  } else if (isHorizontalLayout) {
    // 2x1, 3x2: Horizontal
    containerClass = "flex-row gap-4";
    fontSizeClass = "text-6xl";
    timerMinWidth = "min-w-[80px]";

    // Tighter for 2x1 specifically if needed, but 6xl usually fits 2x1. 
    // Let's be safe and use 5xl for 2x1 if it's really short? 
    // Actually 2x1 is quite wide. 6xl should be fine horizontally.
    // But vertical space might be tight.
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white p-4 relative overflow-hidden font-sans selection:bg-white/20">

      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 pointer-events-none" />

      {/* Main Content */}
      <div className={`z-10 flex ${containerClass} items-center justify-center w-full h-full`}>

        {/* Timer Display */}
        <div className={`relative flex justify-center ${timerMinWidth}`}>
          <div className={`font-mono font-bold tracking-tighter leading-none transition-all duration-300 tabular-nums ${fontSizeClass}`}>
            {formattedTime}
            {showDecimals && <span className="text-2xl opacity-50 ml-0.5">s</span>}
          </div>
        </div>

        {/* Controls Container */}
        <div className={`flex flex-col items-center gap-3 ${isHorizontalLayout ? 'items-start' : ''}`}>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className={`
                flex items-center justify-center rounded-full transition-all active:scale-95
                ${isSmall ? 'w-10 h-10' : 'w-12 h-12'}
                ${isActive
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                }
              `}
            >
              {isActive ? <Pause size={isSmall ? 18 : 20} fill="currentColor" /> : <Play size={isSmall ? 18 : 20} fill="currentColor" className="ml-0.5" />}
            </button>

            <button
              onClick={handleReset}
              className={`
                flex items-center justify-center rounded-full transition-all active:scale-95
                bg-white/10 text-white/70 hover:bg-white/20 hover:text-white
                ${isSmall ? 'w-10 h-10' : 'w-12 h-12'}
              `}
            >
              <RotateCcw size={isSmall ? 16 : 18} />
            </button>
          </div>

          {/* Duration Slider */}
          {showSlider && (
            <div className={`flex flex-col gap-1.5 animate-in fade-in duration-500 ${isHorizontalLayout ? 'w-32' : 'w-40'}`}>
              <div className="flex justify-between text-[10px] font-medium text-white/40 uppercase tracking-wider">
                <span>Duration</span>
                <span>{duration}s</span>
              </div>
              <input
                type="range"
                min="3"
                max="60"
                value={duration}
                onChange={(e) => {
                  setDuration(Number(e.target.value));
                  if (!isActive) setTimeLeft(Number(e.target.value));
                }}
                disabled={isActive}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
