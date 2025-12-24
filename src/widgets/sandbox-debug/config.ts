import { z } from "zod";

export const WIDGET_CONFIG = {
  schema: z.object({
    enableAutoLog: z.boolean().default(false).describe("Auto Console Logs"),
  })
};
