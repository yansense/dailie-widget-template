import type { WidgetConfig } from "dailie-widget-sdk";

export const WIDGET_CONFIG: WidgetConfig = {
  props: {
    type: "object",
    properties: {
      enableAutoLog: {
        type: "boolean",
        title: "自动日志 (Auto Console Logs)",
        default: false,
      },
    },
  },
  panel: {
    type: "Page",
    children: [
      {
        type: "Section",
        props: { title: "调试设置" },
        children: [
          {
            type: "Switch",
            props: { label: "启用自动日志" },
            bind: "enableAutoLog",
          },
        ],
      },
    ],
  },
};
