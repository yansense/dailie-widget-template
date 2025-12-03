import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 扫描 src/widgets 下的所有组件
function getWidgetEntries() {
  const targetWidget = process.env.TARGET_WIDGET;
  const widgetsDir = path.resolve(__dirname, "src/widgets");
  
  // If TARGET_WIDGET is specified, only build that one
  if (targetWidget) {
    const entryPath = path.join(widgetsDir, targetWidget, "index.tsx");
    if (fs.existsSync(entryPath)) {
      return { [targetWidget]: entryPath };
    } else {
      console.error(`Widget ${targetWidget} not found!`);
      process.exit(1);
    }
  }

  const entries: Record<string, string> = {};

  if (fs.existsSync(widgetsDir)) {
    const widgets = fs.readdirSync(widgetsDir);
    widgets.forEach((widget) => {
      const entryPath = path.join(widgetsDir, widget, "index.tsx");
      if (fs.existsSync(entryPath)) {
        entries[widget] = entryPath;
      }
    });
  }

  // 如果没有找到 widgets 目录或其中没有组件，回退到默认的 src/index.tsx
  if (Object.keys(entries).length === 0) {
    return {
      widget: path.resolve(__dirname, "src/index.tsx"),
    };
  }

  return entries;
}

export default defineConfig({
  plugins: [react()],
  build: {
    // 1. 库模式打包
    lib: {
      entry: getWidgetEntries(),
      formats: ["es"], // 推荐输出 ES Module
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        entryFileNames: "[name].es.js",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    minify: true,
    emptyOutDir: false,
  },
  define: {
    // 防止某些库报错
    "process.env.NODE_ENV": '"production"',
  },
});
