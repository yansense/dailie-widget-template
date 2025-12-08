import React, { useState, useEffect } from 'react';
import { useWidgetContext, useConfig, defineWidget } from 'dailie-widget-sdk';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin, AlertCircle } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

// Widget Config Interface
interface WeatherConfig {
  location: string;
  apiKey: string;
  unit: 'metric' | 'imperial';
}

function WeatherWidget() {
  const { context, loading: contextLoading } = useWidgetContext();
  const config = useConfig<WeatherConfig>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { location = 'Beijing', apiKey, unit = 'metric' } = config || {};

  useEffect(() => {
    if (!context) return;

    // 如果没有 API Key，就不请求了，直接显示空状态
    if (!apiKey) {
      setLoading(false);
      return;
    }

    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`
        );

        if (!response.ok) {
          if (response.status === 401) throw new Error('Invalid API Key');
          if (response.status === 404) throw new Error('City Not Found');
          throw new Error('API Error');
        }

        const data: OpenWeatherResponse = await response.json();

        // 简化的图标映射
        const getIconType = (code: string) => {
          if (code.includes('01')) return 'sun';
          if (code.includes('02') || code.includes('03') || code.includes('04')) return 'cloud';
          if (code.includes('09') || code.includes('10')) return 'rain';
          if (code.includes('11')) return 'lightning';
          if (code.includes('13')) return 'snow';
          if (code.includes('50')) return 'mist';
          return 'cloud';
        };

        setWeatherData({
          location: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main, // 使用 main (Clear, Rain) 比 description 更好看一点
          icon: getIconType(data.weather[0].icon),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
          feelsLike: Math.round(data.main.feels_like)
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [context, apiKey, location, unit]);

  // Loading State
  if (contextLoading || (!weatherData && loading)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-300 border-t-zinc-500 animate-spin" />
      </div>
    );
  }

  // Error / Empty State
  if (!apiKey || error || !weatherData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4 text-center">
        <AlertCircle className={`w-8 h-8 mb-2 ${error ? 'text-red-500' : 'text-zinc-400'}`} />
        <div className="text-xs text-zinc-500 font-medium">
          {error || 'API Key Required'}
        </div>
      </div>
    );
  }

  // Helper to render icon
  const WeatherIcon = ({ type, className = "" }: { type: string, className?: string }) => {
    switch (type) {
      case 'sun': return <Sun className={`text-amber-500 ${className}`} />;
      case 'rain': return <CloudRain className={`text-blue-500 ${className}`} />;
      case 'cloud': return <Cloud className={`text-zinc-400 ${className}`} />;
      case 'lightning': return <CloudRain className={`text-purple-500 ${className}`} />; // 用 CloudRain 代替暂时
      case 'snow': return <Cloud className={`text-cyan-200 ${className}`} />;
      default: return <Cloud className={`text-zinc-400 ${className}`} />;
    }
  };

  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const gridSize = context?.gridSize || '2x2';
  const isSmall = gridSize === '1x1';
  const isWide = gridSize === '2x1' || gridSize === '3x1'; // 假设有 3x1

  // Base container styles
  const containerClass = "w-full h-full relative overflow-hidden select-none bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-800 dark:text-zinc-100 p-4 flex flex-col";

  // --- Layouts ---

  // 1x1: Minimalist
  if (isSmall) {
    return (
      <div className={`${containerClass} justify-between text-zinc-900 dark:text-zinc-100`}>
        {/* Background Decoration */}
        <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
          <WeatherIcon type={weatherData.icon} className="w-32 h-32" />
        </div>

        <div className="flex justify-end">
          <WeatherIcon type={weatherData.icon} className="w-6 h-6" />
        </div>

        <div className="flex flex-col">
          <div className="text-4xl font-light tracking-tighter">
            {weatherData.temperature}°
          </div>
          <div className="flex items-center gap-1 opacity-60 mt-1 overflow-hidden">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{weatherData.location}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2x1: Balanced Horizontal
  if (isWide) {
    return (
      <div className={`${containerClass}`}>
        <div className="absolute -right-6 -bottom-6 opacity-[0.07] dark:opacity-[0.05] pointer-events-none rotate-12">
          <WeatherIcon type={weatherData.icon} className="w-40 h-40" />
        </div>

        <div className="flex h-full items-center justify-between z-10">
          {/* Left: Main Info */}
          <div className="flex flex-col justify-between h-full py-1">
            <div className="flex items-center gap-1.5 opacity-60">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium uppercase tracking-wide">{weatherData.location}</span>
            </div>

            <div className="flex flex-col">
              <div className="text-5xl font-light tracking-tighter leading-none">
                {weatherData.temperature}°
              </div>
              <div className="text-sm font-medium opacity-80 mt-1 ml-1">{weatherData.condition}</div>
            </div>
          </div>

          {/* Right: Details & Icon */}
          <div className="flex flex-col items-end justify-between h-full py-1">
            <WeatherIcon type={weatherData.icon} className="w-10 h-10 mb-2" />

            <div className="flex flex-col items-end gap-1 text-xs opacity-60 font-medium">
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard / Large Layout (Default)
  return (
    <div className={`${containerClass}`}>
      {/* Decorative BG Icon */}
      <div className="absolute -right-10 -bottom-10 opacity-[0.06] dark:opacity-[0.04] pointer-events-none">
        <WeatherIcon type={weatherData.icon} className="w-64 h-64" />
      </div>

      <div className="flex items-center justify-between mb-6 z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 opacity-60 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">{weatherData.location}</span>
          </div>
          <div className="text-2xl font-light">{getDayOfWeek()}</div>
        </div>
        <WeatherIcon type={weatherData.icon} className="w-12 h-12" />
      </div>

      <div className="flex-1 flex flex-col justify-center z-10">
        <div className="text-7xl font-thin tracking-tighter">
          {weatherData.temperature}°
        </div>
        <div className="text-lg font-medium opacity-60 ml-1">{weatherData.condition}</div>
      </div>

      <div className="flex items-center gap-6 z-10 pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
        <div className="flex flex-col gap-0.5">
          <div className="text-[10px] uppercase tracking-wider opacity-40 font-bold">Wind</div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Wind className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">{weatherData.windSpeed}</span>
            <span className="text-[10px] opacity-60">km/h</span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[10px] uppercase tracking-wider opacity-40 font-bold">Humidity</div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Droplets className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">{weatherData.humidity}</span>
            <span className="text-[10px] opacity-60">%</span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[10px] uppercase tracking-wider opacity-40 font-bold">Feels Like</div>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="text-sm font-medium">{weatherData.feelsLike}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default defineWidget({
  component: WeatherWidget,
  config: {
    // 数据模型 (JSON Schema)
    props: {
      type: 'object',
      properties: {
        apiKey: {
          type: 'string',
          title: 'OpenWeather API Key'
        },
        location: {
          type: 'string',
          title: '城市',
          default: 'Beijing'
        },
        unit: {
          type: 'string',
          title: '单位',
          enum: ['metric', 'imperial'],
          default: 'metric'
        }
      },
      required: ['apiKey']
    },
    // UI 布局 (VDOM)
    panel: {
      type: 'Page',
      children: [
        {
          type: 'Section',
          props: { title: '基础配置' },
          children: [
            {
              type: 'Input',
              props: {
                label: 'API Key',
                placeholder: '请输入 OpenWeatherMap API Key',
                type: 'password'
              },
              bind: 'apiKey'
            },
            {
              type: 'Input',
              props: {
                label: '城市',
                placeholder: '例如: Beijing, Shanghai'
              },
              bind: 'location'
            },
            {
              type: 'Select',
              props: {
                label: '单位',
                options: [
                  { label: '摄氏度 (°C)', value: 'metric' },
                  { label: '华氏度 (°F)', value: 'imperial' }
                ]
              },
              bind: 'unit'
            }
          ]
        },
        {
          type: 'Alert',
          props: {
            status: 'info',
            content: '如果没有 API Key，请访问 openweathermap.org 申请。'
          }
        }
      ]
    }
  }
});