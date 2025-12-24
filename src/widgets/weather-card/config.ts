import { z } from "zod";

export const WIDGET_CONFIG = {
  schema: z.object({
    apiKey: z.string().describe("OpenWeather API Key"),
    location: z.string().default("Beijing").describe("City"),
    unit: z.enum(["metric", "imperial"]).default("metric").describe("Unit"),
  })
};
