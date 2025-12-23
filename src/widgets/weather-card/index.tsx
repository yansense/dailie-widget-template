import { defineWidget, useWidgetScope } from "dailie-widget-sdk";
import React from "react";
import { WIDGET_CONFIG } from "./config";
import { useWeather } from "./use-weather";
import { WeatherView } from "./weather-view";

export default defineWidget({
  id: "weather.card",
  version: "1.0.0",
  meta: {
    title: "Weather Card",
    description: "A simple weather widget",
  },
  config: WIDGET_CONFIG,
  setup() {
    return () => {
      const viewModel = useWeather();
      const { ui } = useWidgetScope();

      // Example usage
      React.useEffect(() => {
        // console.log("Weather Card Mounted, scoped UI available:", !!ui);
      }, [ui]);

      return <WeatherView {...viewModel} />;
    };
  },
});
