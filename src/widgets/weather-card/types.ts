export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export interface WeatherConfig {
  location: string;
  apiKey: string;
  unit: "metric" | "imperial";
}

export interface OpenWeatherResponse {
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

export interface WeatherWidgetViewProps {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  gridSize: string;
}
