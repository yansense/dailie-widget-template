import {
  AlertCircle,
  Cloud,
  CloudRain,
  Droplets,
  MapPin,
  Sun,
  Wind,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "dailie-widget-sdk";
import type React from "react";
import type { WeatherWidgetViewProps } from "./types";

// Animated Counter Component
const AnimatedNumber = ({ value }: { value: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {value}
    </motion.span>
  );
};

export const WeatherView: React.FC<WeatherWidgetViewProps> = ({
  weatherData,
  loading,
  error,
  gridSize,
  widgetStyle = 'classic',
}) => {
  // Loading State
  if (loading) {
    return (
      <div className={cn(
        "w-full h-full flex items-center justify-center",
        widgetStyle === 'classic' ? 'bg-zinc-50 dark:bg-zinc-900' : 'bg-transparent'
      )}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-zinc-300 border-t-zinc-500"
        />
      </div>
    );
  }

  // Error / Empty State
  if (error || !weatherData) {
    return (
      <div className={cn(
        "w-full h-full flex flex-col items-center justify-center p-4 text-center",
        widgetStyle === 'classic' ? 'bg-zinc-50 dark:bg-zinc-900' : 'bg-transparent'
      )}>
        <AlertCircle
          className={cn("w-8 h-8 mb-2", error !== "API Key Required" ? "text-red-500" : "text-zinc-400")}
        />
        <div className="text-xs text-zinc-500 font-medium">{error}</div>
      </div>
    );
  }

  // --- Logic: Parse Grid Size ---
  // Default to 1x1 if format is unexpected
  let rows = 1;
  let cols = 1;

  if (gridSize && gridSize.includes('x')) {
    const parts = gridSize.split('x');
    cols = parseInt(parts[0], 10) || 1;
    rows = parseInt(parts[1], 10) || 1;
  }

  // Responsive Buckets
  const isSmall = cols === 1 && rows === 1; // 1x1
  const isTall = cols === 1 && rows >= 2;   // 1x2, 1x3...
  const isWide = cols >= 2 && rows === 1;   // 2x1, 3x1...
  const isLarge = cols >= 2 && rows >= 2;   // 2x2, 3x3, etc.

  // --- Components ---

  // Animated Icon
  const WeatherIcon = ({
    type,
    className = "",
    large = false
  }: {
    type: string;
    className?: string;
    large?: boolean;
  }) => {
    // Floating animation for large icons
    const animation = large ? {
      y: [0, -10, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    } : {};

    const IconComponent = () => {
      switch (type) {
        case "sun":
          return <Sun className={cn("text-amber-500", className)} />;
        case "rain":
          return <CloudRain className={cn("text-blue-500", className)} />;
        case "cloud":
          return <Cloud className={cn("text-zinc-400", className)} />;
        case "lightning":
          return <CloudRain className={cn("text-purple-500", className)} />;
        case "snow":
          return <Cloud className={cn("text-cyan-200", className)} />;
        default:
          return <Cloud className={cn("text-zinc-400", className)} />;
      }
    };

    return (
      <motion.div animate={animation}>
        <IconComponent />
      </motion.div>
    );
  };

  const getDayOfWeek = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };


  // Base container styles
  const containerClass = cn(
    "w-full h-full relative overflow-hidden select-none p-4 flex flex-col",
    widgetStyle === 'classic'
      ? 'bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950'
      : 'bg-transparent',
    "text-zinc-800 dark:text-zinc-100"
  );

  return (
    <AnimatePresence mode="wait">
      {/* 1x1: Minimalist */}
      {isSmall && (
        <motion.div
          key="small"
          className={cn(containerClass, "justify-between")}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
            <WeatherIcon type={weatherData.icon} className="w-32 h-32" />
          </div>

          <motion.div
            className="flex justify-end"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <WeatherIcon type={weatherData.icon} className="w-8 h-8" large />
          </motion.div>

          <div className="flex flex-col">
            <div className="text-5xl font-light tracking-tighter">
              <AnimatedNumber value={weatherData.temperature} />°
            </div>
            <motion.div
              className="flex items-center gap-1 opacity-60 mt-1 overflow-hidden"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs font-medium truncate">
                {weatherData.location}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Tall: Vertical Stack (e.g. 1x2, 1x3) */}
      {isTall && (
        <motion.div
          key="tall"
          className={cn(containerClass)}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Decor */}
          <div className="absolute -right-8 -bottom-8 opacity-[0.05] pointer-events-none">
            <WeatherIcon type={weatherData.icon} className="w-48 h-48" />
          </div>

          {/* Top: Header */}
          <div className="flex flex-col items-center pt-2 z-10 text-center">
            <div className="text-sm font-medium opacity-60 uppercase tracking-widest mb-1">
              {weatherData.location}
            </div>
            <div className="text-lg font-light opacity-80">{getDayOfWeek()}</div>
          </div>

          {/* Middle: Graphics */}
          <div className="flex-1 flex flex-col items-center justify-center z-10 py-4">
            <WeatherIcon type={weatherData.icon} className="w-16 h-16 mb-4" large />
            <div className="text-6xl font-thin tracking-tighter">
              <AnimatedNumber value={weatherData.temperature} />°
            </div>
            <div className="text-sm font-medium opacity-60">
              {weatherData.condition}
            </div>
          </div>

          {/* Bottom: Details Stack */}
          <div className="flex flex-col gap-2 w-full z-10 border-t border-black/5 dark:border-white/5 pt-4">
            {[
              { label: 'Wind', value: weatherData.windSpeed, unit: 'km/h', icon: Wind },
              { label: 'Hum', value: weatherData.humidity, unit: '%', icon: Droplets },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-center justify-between"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                <div className="flex items-center gap-2 opacity-60">
                  <item.icon className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase font-bold tracking-wider">{item.label}</span>
                </div>
                <span className="text-xs font-medium">{item.value}{item.unit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Wide: Balanced Horizontal (e.g., 2x1) */}
      {isWide && (
        <motion.div
          key="wide"
          className={containerClass}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute -right-6 -bottom-6 opacity-[0.07] dark:opacity-[0.05] pointer-events-none rotate-12">
            <WeatherIcon type={weatherData.icon} className="w-40 h-40" />
          </div>

          <div className="flex h-full items-center justify-between z-10">
            {/* Left: Main Info */}
            <div className="flex flex-col justify-between h-full py-1">
              <div className="flex items-center gap-1.5 opacity-60">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  {weatherData.location}
                </span>
              </div>

              <div className="flex flex-col">
                <div className="text-6xl font-light tracking-tighter leading-none">
                  <AnimatedNumber value={weatherData.temperature} />°
                </div>
                <div className="text-sm font-medium opacity-80 mt-1 ml-1">
                  {weatherData.condition}
                </div>
              </div>
            </div>

            {/* Right: Details & Icon */}
            <div className="flex flex-col items-end justify-between h-full py-1">
              <WeatherIcon type={weatherData.icon} className="w-12 h-12 mb-2" large />

              <motion.div
                className="flex flex-col items-end gap-1 text-xs opacity-60 font-medium"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, staggerChildren: 0.1 }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="tracking-wider">WIND</span>
                  <Wind className="w-3 h-3" />
                  <span>{weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="tracking-wider">HUM</span>
                  <Droplets className="w-3 h-3" />
                  <span>{weatherData.humidity}%</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Large: Featured Layout (e.g., 2x2, 2x3...) */}
      {isLarge && (
        <motion.div
          key="large"
          className={containerClass}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative BG Icon */}
          <div className="absolute -right-10 -bottom-10 opacity-[0.06] dark:opacity-[0.04] pointer-events-none">
            <WeatherIcon type={weatherData.icon} className="w-64 h-64" />
          </div>

          <div className="flex items-center justify-between mb-4 z-10 shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 opacity-60 mb-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {weatherData.location}
                </span>
              </div>
              <div className="text-xl font-light leading-tight">{getDayOfWeek()}</div>
            </div>
            <WeatherIcon type={weatherData.icon} className="w-14 h-14" large />
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-0 z-10">
            <div className="text-7xl font-thin tracking-tighter">
              <AnimatedNumber value={weatherData.temperature} />°
            </div>
            <div className="text-lg font-medium opacity-60 ml-1">
              {weatherData.condition}
            </div>
          </div>

          <div className="flex items-center gap-4 z-10 pt-3 border-t border-black/5 dark:border-white/5 mt-auto shrink-0 overflow-hidden">
            {/* Details Footer - Adjusted for compactness */}
            {[
              { label: 'Wind', value: weatherData.windSpeed, unit: 'km/h', icon: Wind },
              { label: 'Humidity', value: weatherData.humidity, unit: '%', icon: Droplets },
              { label: 'Feel', value: `${weatherData.feelsLike}°`, icon: null }
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex flex-col gap-0.5 min-w-0"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                <div className="text-[9px] uppercase tracking-wider opacity-40 font-bold truncate">
                  {item.label}
                </div>
                <div className="flex items-center gap-1 opacity-80">
                  {item.icon && <item.icon className="w-3 h-3 flex-shrink-0" />}
                  <span className="text-xs font-medium whitespace-nowrap">{item.value}{item.unit && <span className="opacity-60 ml-0.5">{item.unit}</span>}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
