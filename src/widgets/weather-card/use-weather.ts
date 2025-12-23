import { useConfig, useWidgetContext } from "dailie-widget-sdk";
import { useEffect, useState, useMemo } from "react";
import { fetchWeatherFromApi } from "./model";
import type {
  WeatherConfig,
  WeatherData,
  WeatherWidgetViewProps,
} from "./types";

export const useWeather = (): WeatherWidgetViewProps => {
  const { context, loading: contextLoading } = useWidgetContext();
  const config = useConfig<WeatherConfig>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize config values to prevent unnecessary re-fetches
  const location = useMemo(() => config?.location, [config?.location]);
  const apiKey = useMemo(() => config?.apiKey, [config?.apiKey]);
  const unit = useMemo(() => config?.unit, [config?.unit]);

  useEffect(() => {
    if (!context) return;

    // Derived config with defaults
    const activeConfig: WeatherConfig = {
      location: location || "Beijing",
      apiKey: apiKey || "",
      unit: unit || "metric",
    };

    if (!activeConfig.apiKey) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeatherFromApi(activeConfig);
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, [location, apiKey, unit]); // Only depend on memoized config values

  return {
    weatherData,
    loading: contextLoading || (!weatherData && loading),
    error: !config?.apiKey ? "API Key Required" : error,
    gridSize: context?.gridSize || "2x2",
    widgetStyle: context?.widgetStyle,
  };
};
