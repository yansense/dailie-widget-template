import {
  defineWidget,
  ui,
  useConfig,
  useStorage,
  useWidgetContext,
  getSDKInfo,
} from "dailie-widget-sdk";
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Globe,
  Info,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";

function TestWidget() {
  const { context } = useWidgetContext();
  const config = useConfig<{ apiKey: string }>();

  // Storage Test
  const { value: count, setValue: setCount } = useStorage<number>(
    "test-counter",
    0,
  );

  // Fetch Test State
  const [data, setData] = useState<string>("No data fetched");
  const [loading, setLoading] = useState(false);

  // Settings Overlay State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleToast = (type: "success" | "error" | "info" | "warning") => {
    switch (type) {
      case "success":
        console.log("[TestWidget] Invoking ui.toast.success");
        ui.toast.success("Operation successful!");
        break;
      case "error":
        ui.toast.error("Something went wrong.");
        break;
      case "info":
        ui.toast.info("Here is some information.");
        break;
      case "warning":
        ui.toast.warning("Warning: Low battery.");
        break;
    }
  };

  const handleAlert = async () => {
    await ui.alert("This is a blocking alert!");
  };

  const handleConfirm = async () => {
    const result = await ui.confirm("Are you sure you want to proceed?");
    if (result) ui.toast.success("Confirmed!");
    else ui.toast.info("Cancelled.");
  };

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      setData(JSON.stringify(json).slice(0, 50) + "...");
      ui.toast.success("Data fetched!");
    } catch (err) {
      ui.toast.error("Fetch failed");
      setData("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group w-full h-full relative overflow-hidden select-none flex flex-col p-4 bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Decorative Background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 z-10">
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          SDK Tester
        </h1>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            {context?.gridSize || "1x1"}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto">
        {/* Toast Section */}
        <div className="col-span-2 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            Notifications
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleToast("success")}
              className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 transition-colors"
            >
              <CheckCircle size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleToast("error")}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleToast("info")}
              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition-colors"
            >
              <Info size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleToast("warning")}
              className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 transition-colors"
            >
              <AlertTriangle size={16} />
            </button>
          </div>
        </div>

        {/* Dialog Section */}
        <div className="col-span-1 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            Dialogs
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={handleAlert}
              className="px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-left truncate"
            >
              Alert
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-left truncate"
            >
              Confirm
            </button>
          </div>
        </div>

        {/* Storage Section */}
        <div className="col-span-1 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            Storage
          </div>
          <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-md p-2">
            <Database size={14} className="opacity-50" />
            <span className="font-mono font-bold">{count}</span>
            <button
              type="button"
              onClick={() => setCount((count || 0) + 1)}
              className="w-5 h-5 flex items-center justify-center bg-indigo-500 text-white rounded-full hover:bg-indigo-600 text-xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Fetch Section */}
        <div className="col-span-2 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            Network
          </div>
          <button
            type="button"
            onClick={handleFetch}
            disabled={loading}
            className="w-full relative overflow-hidden group/btn flex items-center gap-2 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg transition-colors"
          >
            <Globe size={14} />
            <span className="text-xs font-medium truncate">
              {loading ? "Loading..." : "Fetch Data"}
            </span>
            {data !== "No data fetched" && (
              <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 w-full" />
            )}
          </button>
          <div className="text-[10px] text-zinc-400 truncate font-mono">
            {data}
          </div>
        </div>

        {/* SDK Info Section - TEST BUNDLED SDK */}
        <div className="col-span-2 space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-3">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            SDK Info (Bundling Test)
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 space-y-1">
            <div className="text-xs font-bold text-green-600 dark:text-green-400">
              {getSDKInfo().message}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
              Version: {getSDKInfo().version}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
              Bundled: {getSDKInfo().bundled ? "✅ YES" : "❌ NO"}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
              Time: {getSDKInfo().timestamp}
            </div>
          </div>
        </div>
      </div>

      {/* Stealth Settings Button */}
      <button
        type="button"
        onClick={() => setIsSettingsOpen(true)}
        className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-2 right-2 p-1.5 hover:bg-zinc-200/50 dark:hover:bg-white/10 rounded-full backdrop-blur-sm z-50 text-zinc-500 dark:text-zinc-400"
      >
        <Settings size={14} />
      </button>

      {/* In-Card Settings Overlay */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold">Settings</h2>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full"
            >
              <CheckCircle size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500">
                API Key
              </label>
              <div className="mt-1 p-2 bg-zinc-100 dark:bg-zinc-900 rounded text-sm text-zinc-500 font-mono truncate">
                {config.apiKey || "No key set"}
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              This overlay demonstrates the "Flip" interaction pattern for
              settings that don't need the global config panel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default defineWidget({
  id: "test.widget",
  version: "1.0.0",
  meta: {
    title: "SDK Tester",
    description: "A widget to test SDK capabilities",
  },
  config: {
    props: {
      type: "object",
      properties: {
        apiKey: { type: "string", title: "API Key" },
      },
    },
    panel: {
      type: "Page",
      children: [
        {
          type: "Section",
          props: { title: "General" },
          children: [
            {
              type: "Input",
              props: { label: "API Key", type: "password" },
              bind: "apiKey",
            },
          ],
        },
      ],
    },
  },
  setup() {
    return () => <TestWidget />;
  },
});
