import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const widgetsDir = path.resolve(__dirname, "../src/widgets");

async function buildWidget(widgetName) {
  return new Promise((resolve, reject) => {
    console.log(`[build] Building ${widgetName}...`);
    const build = spawn("vite", ["build"], {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, TARGET_WIDGET: widgetName },
    });

    build.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Build failed for ${widgetName} with code ${code}`));
      }
    });
  });
}

async function buildAll() {
  if (!fs.existsSync(widgetsDir)) {
    console.log("No widgets directory found.");
    return;
  }

  // Clean dist directory
  const distDir = path.resolve(__dirname, "../dist");
  if (fs.existsSync(distDir)) {
    console.log("[build] Cleaning dist directory...");
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  const widgets = fs.readdirSync(widgetsDir).filter((file) => {
    return fs.statSync(path.join(widgetsDir, file)).isDirectory();
  });

  for (const widget of widgets) {
    // Check if index.tsx exists
    if (fs.existsSync(path.join(widgetsDir, widget, "index.tsx"))) {
      try {
        await buildWidget(widget);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }
  }
  
  console.log("[build] All widgets built successfully.");
}

buildAll();
