import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const widgetsDir = path.resolve(__dirname, "../src/widgets");

// Map to store active build processes (though we might just fire and forget for simple builds,
// but vite build --watch is long running.
// Wait, the user wants single file bundles. `vite build --watch` might still try to code split if we run it on all.
// But if we run `vite build --watch` with TARGET_WIDGET, it works for one.
// We can't easily run multiple `vite build --watch` processes in parallel for many widgets without resource issues.
// Better approach for "dev":
// 1. Build all initially.
// 2. Watch files.
// 3. When a file changes, run `vite build` (one-off) for that widget.
// This is slower than keeping them all in memory, but ensures isolation and low memory usage.

let isBuilding = false;
const buildQueue = new Set();

function triggerBuild(widgetName) {
  if (buildQueue.has(widgetName)) return;
  buildQueue.add(widgetName);
  processQueue();
}

async function processQueue() {
  if (isBuilding || buildQueue.size === 0) return;

  isBuilding = true;
  const widgetName = buildQueue.values().next().value;
  buildQueue.delete(widgetName);

  console.log(`[watch] Rebuilding ${widgetName}...`);

  const build = spawn("vite", ["build"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, TARGET_WIDGET: widgetName, BUNDLE_SDK: "true" },
  });

  build.on("close", (code) => {
    isBuilding = false;
    if (code === 0) {
      console.log(`[watch] ${widgetName} built successfully.`);
    } else {
      console.error(`[watch] Build failed for ${widgetName}.`);
    }
    // Process next item
    processQueue();
  });
}

// Initial build of all widgets
console.log("[watch] Running initial build...");
const initialBuild = spawn("node", [path.join(__dirname, "build.js")], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, BUNDLE_SDK: "true" },
});

initialBuild.on("close", () => {
  console.log("[watch] Initial build complete. Watching for changes...");

  // Watch for changes
  const watcher = chokidar.watch(widgetsDir, {
    ignoreInitial: true,
    depth: 99, // Watch recursively
  });

  watcher.on("all", (event, filePath) => {
    // Find which widget this file belongs to
    const relative = path.relative(widgetsDir, filePath);
    const widgetName = relative.split(path.sep)[0];

    if (widgetName && widgetName !== ".." && !widgetName.startsWith(".")) {
      if (event === "unlinkDir" && relative === widgetName) {
        // Widget directory removed
        console.log(`[watch] Widget removed: ${widgetName}`);
        const distFile = path.resolve(__dirname, `../dist/${widgetName}.es.js`);
        import("node:fs").then((fs) => {
          if (fs.existsSync(distFile)) {
            fs.unlinkSync(distFile);
            console.log(`[watch] Removed artifact: ${widgetName}.es.js`);
          }
        });
      } else {
        // Check if it's a valid widget directory (has index.tsx or we are adding it)
        // We can just try to build it.
        triggerBuild(widgetName);
      }
    }
  });
});
