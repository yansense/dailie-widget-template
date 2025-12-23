# Weather Card Architecture

## Overview
The **Weather Card** displays current weather conditions for a configured location. It uses the OpenWeatherMap API and supports multiple layouts (1x1, 2x1, 2x2).

### File Structure
- `types.ts`: Shared interfaces.
- `config.ts`: Configuration schema and panel layout.
- `model.ts`: API interaction logic.
- `use-weather.ts`: Logic controller (ViewModel).
- `weather-view.tsx`: Pure UI component.
- `index.tsx`: Entry point.

## Config
The widget uses `dailie-widget-sdk` configuration system.

### Properties (JSON Schema)
- `apiKey` (string): OpenWeatherMap API Key.
- `location` (string): City name (default: "Beijing").
- `unit` (string): "metric" | "imperial".



## Interface
Defined in `types.ts`.

```typescript
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export interface WeatherWidgetViewProps {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  gridSize: string;
}
```

## Model
Defined in `model.ts`.

Responsible for fetching and parsing data.

```typescript
// Fetches data from OpenWeatherMap and adapts it to WeatherData
export const fetchWeatherFromApi = async (config: WeatherConfig): Promise<WeatherData>;
```

## ViewModel
Defined in `use-weather.ts`.

Manages state, effects, and configuration derived values.

```typescript
export const useWeather = (): WeatherWidgetViewProps => {
    // State: weatherData, loading, error
    // Effect: Fetches data on mount/config change using fetchWeatherFromApi
    // Effect: Refreshes every 10 minutes
    
    return {
        weatherData, // WeatherData | null
        loading,     // boolean
        error,       // string | null
        gridSize     // string
    };
};
```

## View
Defined in `weather-view.tsx`.

Pure functional component. Renders different layouts based on `gridSize`.

```typescript
export const WeatherView: React.FC<WeatherWidgetViewProps>;
```
- **1x1**: Minimal (Temp + Icon).
- **2x1 / 2x2**: Detailed (Temp, Condition, Wind, Humidity, Feels Like).
