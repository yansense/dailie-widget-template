import { MessageSquare, AlertTriangle, XCircle, Terminal, Bug } from "lucide-react";

export const ConsoleControls = () => {
  const handleConsoleLog = () => console.log("[SandboxDebug] This is a console.log message");
  const handleConsoleWarn = () => console.warn("[SandboxDebug] This is a console.warn message");
  const handleConsoleError = () => console.error("[SandboxDebug] This is a console.error message");
  const handleConsoleInfo = () => console.info("[SandboxDebug] This is a console.info message");
  const handleComplexLog = () => {
    console.log("[SandboxDebug] Complex object:", {
      user: { name: "Test User", id: 123 },
      timestamp: Date.now(),
      nested: { level1: { level2: { value: "deep" } } },
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
        <Terminal size={12} />
        日志测试 (Console Logs)
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleConsoleLog}
          className="flex items-center gap-2 px-3 py-2 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
        >
          <MessageSquare size={14} />
          console.log
        </button>
        <button
          type="button"
          onClick={handleConsoleWarn}
          className="flex items-center gap-2 px-3 py-2 text-xs bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-lg transition-colors"
        >
          <AlertTriangle size={14} />
          console.warn
        </button>
        <button
          type="button"
          onClick={handleConsoleError}
          className="flex items-center gap-2 px-3 py-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
        >
          <XCircle size={14} />
          console.error
        </button>
        <button
          type="button"
          onClick={handleConsoleInfo}
          className="flex items-center gap-2 px-3 py-2 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg transition-colors"
        >
          <Terminal size={14} />
          console.info
        </button>
      </div>
      <button
        type="button"
        onClick={handleComplexLog}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg transition-colors"
      >
        <Bug size={14} />
        Log Complex Object
      </button>
    </div>
  );
};
