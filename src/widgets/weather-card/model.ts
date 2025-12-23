import type { OpenWeatherResponse, WeatherConfig, WeatherData } from "./types";

export const fetchWeatherFromApi = async (
  config: WeatherConfig,
): Promise<WeatherData> => {
  const { location = "Beijing", apiKey, unit = "metric" } = config;

  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`,
  );

  if (!response.ok) {
    if (response.status === 401) throw new Error("Invalid API Key");
    if (response.status === 404) throw new Error("City Not Found");
    throw new Error("API Error");
  }

  const data: OpenWeatherResponse = await response.json();

  const getIconType = (code: string) => {
    if (code.includes("01")) return "sun";
    if (code.includes("02") || code.includes("03") || code.includes("04"))
      return "cloud";
    if (code.includes("09") || code.includes("10")) return "rain";
    if (code.includes("11")) return "lightning";
    if (code.includes("13")) return "snow";
    if (code.includes("50")) return "mist";
    return "cloud";
  };

  return {
    location: data.name,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    icon: getIconType(data.weather[0].icon),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6),
    feelsLike: Math.round(data.main.feels_like),
  };
};
