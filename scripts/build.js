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

  // Determine requested component (from argv or env)
  function getRequestedComponent() {
    // Check for --component=foo or -c=foo
    const arg = process.argv.slice(2).find((a) => a.startsWith("--component=") || a.startsWith("-c="));
    if (arg) return arg.split(/=(.+)/)[1];

    // Check for separate flag form: --component foo
    const idx = process.argv.indexOf("--component");
    if (idx !== -1 && process.argv.length > idx + 1) return process.argv[idx + 1];

    const idx2 = process.argv.indexOf("-c");
    if (idx2 !== -1 && process.argv.length > idx2 + 1) return process.argv[idx2 + 1];

    // direct first arg (we pass "$npm_config_component" from package.json)
    if (process.argv[2] && !process.argv[2].startsWith("-")) return process.argv[2];

    // npm config and env fallbacks
    if (process.env.npm_config_component) return process.env.npm_config_component;
    if (process.env.TARGET_WIDGET) return process.env.TARGET_WIDGET;

    return null;
  }

  const requested = getRequestedComponent();

  const distDir = path.resolve(__dirname, "../dist");

  const widgets = fs.readdirSync(widgetsDir).filter((file) => {
    return fs.statSync(path.join(widgetsDir, file)).isDirectory();
  });

  if (requested) {
    // Build only the requested widget
    if (!widgets.includes(requested)) {
      console.error(`[build] Widget '${requested}' not found. Available widgets: ${widgets.join(", ")}`);
      process.exit(1);
    }

    const indexPath = path.join(widgetsDir, requested, "index.tsx");
    if (!fs.existsSync(indexPath)) {
      console.error(`[build] Widget '${requested}' does not contain index.tsx at ${indexPath}`);
      process.exit(1);
    }

    // Clean only the requested widget's dist subfolder to avoid removing other widgets' builds
    const widgetDist = path.join(distDir, requested);
    if (fs.existsSync(widgetDist)) {
      console.log(`[build] Cleaning dist for widget '${requested}'...`);
      fs.rmSync(widgetDist, { recursive: true, force: true });
    }

    try {
      await buildWidget(requested);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }

    console.log(`[build] Widget '${requested}' built successfully.`);
    return;
  }

  // No specific widget requested: build all
  // Clean full dist when building all widgets
  if (fs.existsSync(distDir)) {
    console.log("[build] Cleaning dist directory...");
    fs.readdirSync(distDir).forEach(f => fs.rmSync(path.join(distDir, f), { recursive: true, force: true }));
  } else {
    fs.mkdirSync(distDir, { recursive: true });
  }

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
