import { defineWidget, useConfig, useWidgetContext } from "dailie-widget-sdk";
import {
  CloudRain,
  CloudSun,
  Droplets,
  RotateCw,
  Sun,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- 1. Component Implementation ---

function WeatherWidget() {
  const { context } = useWidgetContext();
  const config = useConfig();

  // State
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    temp: 72,
    condition: "sunny",
    humidity: 45,
    wind: 12,
  });

  const isSmall = context.gridSize === "1x1";
  const isMetric = config.unit === "metric";

  // Mock Fetch Logic (Replace with real API call using config.apiKey)
  const refreshWeather = async () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      // Randomize slightly for demo purposes
      setData({
        temp: isMetric ? 22 : 72,
        condition: "partly-cloudy",
        humidity: 45,
        wind: 12,
      });
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    refreshWeather();
  }, [config.city, config.unit]);

  // Icon Helper
  const getIcon = (condition: string, size: number, className = "") => {
    switch (condition) {
      case "rain":
        return <CloudRain size={size} className={className} />;
      case "sunny":
        return <Sun size={size} className={className} />;
      default:
        return <CloudSun size={size} className={className} />;
    }
  };

  return (
    // ROOT: Mandatory Container Structure with 'group' for hover effects
    <div className="group w-full h-full relative overflow-hidden select-none flex flex-col bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* DECORATION: Background Texture (Subtle Depth) */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transform rotate-12">
        {getIcon(data.condition, 120)}
      </div>

      {/* HEADER: Location + Stealth Refresh */}
      <div
        className={`flex justify-between items-start z-10 ${isSmall ? "p-3" : "p-4 pb-0"}`}
      >
        <div className="flex flex-col">
          {/* Hide city on 1x1 to save space, show generic 'Weather' or strict temp focus */}
          <span
            className={`font-semibold tracking-tight text-zinc-500 dark:text-zinc-400 ${isSmall ? "text-[10px] uppercase" : "text-xs"}`}
          >
            {isSmall ? "Now" : config.city || "Select City"}
          </span>
        </div>

        {/* INTERACTION: Stealth Refresh Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            refreshWeather();
          }}
          disabled={loading}
          className={`
            transition-all duration-200 
            opacity-0 group-hover:opacity-100 
            hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 
            rounded-md p-1 -mt-1 -mr-1
            ${loading ? "animate-spin opacity-100" : ""}
          `}
        >
          <RotateCw size={14} className="text-zinc-500" />
        </button>
      </div>

      {/* MAIN CONTENT: Adaptive Layout */}
      <div
        className={`flex-1 flex flex-col z-10 ${isSmall ? "px-3 pb-3 justify-center" : "px-4 pb-4 justify-between"}`}
      >
        {/* Temperature & Icon Hero */}
        <div className="flex items-center gap-3">
          <div className="text-indigo-500 dark:text-indigo-400 drop-shadow-sm">
            {getIcon(data.condition, isSmall ? 32 : 40)}
          </div>
          <div className="flex flex-col">
            <span
              className={`font-bold tracking-tighter tabular-nums leading-none ${isSmall ? "text-3xl" : "text-4xl"}`}
            >
              {data.temp}°
            </span>
            {!isSmall && (
              <span className="text-xs text-zinc-400 font-medium mt-1">
                Partly Cloudy
              </span>
            )}
          </div>
        </div>

        {/* DETAILS: Hidden on 1x1, Visible on larger grids */}
        {!isSmall && (
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-2">
              <Droplets size={14} className="text-zinc-400" />
              <span className="text-xs font-medium tracking-tight text-zinc-600 dark:text-zinc-300">
                {data.humidity}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wind size={14} className="text-zinc-400" />
              <span className="text-xs font-medium tracking-tight text-zinc-600 dark:text-zinc-300">
                {data.wind} {isMetric ? "km/h" : "mph"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 2. Widget Definition & Config Schema ---

export default defineWidget({
  component: WeatherWidget,
  config: {
    // A. Data Model
    props: {
      type: "object",
      properties: {
        city: {
          type: "string",
          title: "City Name",
          default: "San Francisco",
        },
        apiKey: {
          type: "string",
          title: "Weather API Key",
        },
        unit: {
          type: "string",
          title: "Unit System",
          enum: ["metric", "imperial"],
          default: "metric",
        },
      },
      required: ["city"],
    },
    // B. UI Layout (Whitelist Only)
    panel: {
      type: "Page",
      children: [
        {
          type: "Section",
          props: { title: "Location" },
          children: [
            {
              type: "Input",
              props: {
                label: "City",
                placeholder: "e.g. London",
                type: "text",
              },
              bind: "city",
            },
            {
              type: "Select",
              props: {
                label: "Units",
                options: [
                  { label: "Metric (°C)", value: "metric" },
                  { label: "Imperial (°F)", value: "imperial" },
                ],
              },
              bind: "unit",
            },
          ],
        },
        {
          type: "Section",
          props: { title: "Advanced" },
          children: [
            {
              type: "Input",
              props: {
                label: "API Key (Optional)",
                type: "password",
                placeholder: "Paste key here...",
              },
              bind: "apiKey",
            },
            {
              type: "Alert",
              props: {
                status: "info",
                content: "If no API Key is provided, demo data will be shown.",
              },
            },
          ],
        },
      ],
    },
  },
});
