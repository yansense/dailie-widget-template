import { defineWidget } from "dailie-widget-sdk";
import React from "react";
import { WIDGET_CONFIG } from "./config";
import { useWeather } from "./use-weather";
import { WeatherView } from "./weather-view";

function WeatherWidget() {
  const viewModel = useWeather();
  return <WeatherView {...viewModel} />;
}

export default defineWidget({
  component: WeatherWidget,
  config: WIDGET_CONFIG,
});
