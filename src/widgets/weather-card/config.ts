export const WIDGET_CONFIG = {
  props: {
    type: "object",
    properties: {
      apiKey: {
        type: "string",
        title: "OpenWeather API Key",
      },
      location: {
        type: "string",
        title: "城市",
        default: "Beijing",
      },
      unit: {
        type: "string",
        title: "单位",
        enum: ["metric", "imperial"],
        default: "metric",
      },
    },
    required: ["apiKey"],
  },
  panel: {
    type: "Page",
    children: [
      {
        type: "Section",
        props: { title: "基础配置" },
        children: [
          {
            type: "Input",
            props: {
              label: "API Key",
              placeholder: "请输入 OpenWeatherMap API Key",
              type: "password",
            },
            bind: "apiKey",
          },
          {
            type: "Input",
            props: {
              label: "城市",
              placeholder: "例如: Beijing, Shanghai",
            },
            bind: "location",
          },
          {
            type: "Select",
            props: {
              label: "单位",
              options: [
                { label: "摄氏度 (°C)", value: "metric" },
                { label: "华氏度 (°F)", value: "imperial" },
              ],
            },
            bind: "unit",
          },
        ],
      },
      {
        type: "Alert",
        props: {
          status: "info",
          content: "如果没有 API Key，请访问 openweathermap.org 申请。",
        },
      },
    ],
  },
};
