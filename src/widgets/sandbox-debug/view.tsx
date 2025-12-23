import { useConfig } from "dailie-widget-sdk";
import {
  AlertTriangle,
  Bug,
  MessageSquare,
  Terminal,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DebugConfig {
  enableAutoLog?: boolean;
}

export function SandboxDebugView() {
  const config = useConfig<DebugConfig>();
  const [crashTriggered, setCrashTriggered] = useState(false);
  const [_asyncCrashTriggered, setAsyncCrashTriggered] = useState(false);

  // 自动日志测试
  useEffect(() => {
    if (config.enableAutoLog) {
      const interval = setInterval(() => {
        console.log("[SandboxDebug] Auto log tick:", new Date().toISOString());
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [config.enableAutoLog]);

  // ===== 日志测试函数 =====

  const handleConsoleLog = () => {
    console.log("[SandboxDebug] This is a console.log message");
  };

  const handleConsoleWarn = () => {
    console.warn("[SandboxDebug] This is a console.warn message");
  };

  const handleConsoleError = () => {
    console.error("[SandboxDebug] This is a console.error message");
  };

  const handleConsoleInfo = () => {
    console.info("[SandboxDebug] This is a console.info message");
  };

  const handleComplexLog = () => {
    console.log("[SandboxDebug] Complex object:", {
      user: { name: "Test User", id: 123 },
      timestamp: Date.now(),
      nested: { level1: { level2: { value: "deep" } } },
    });
  };

  // ===== 崩溃测试函数 =====

  const handleSyncCrash = () => {
    // 触发同步崩溃
    setCrashTriggered(true);
  };

  const handleAsyncCrash = () => {
    // 触发异步崩溃（Promise rejection）
    setAsyncCrashTriggered(true);
    setTimeout(() => {
      throw new Error("[SandboxDebug] Async crash: setTimeout error");
    }, 100);
  };

  const handleUnhandledRejection = () => {
    // 未捕获的 Promise rejection
    Promise.reject(
      new Error("[SandboxDebug] Unhandled Promise rejection test"),
    );
  };

  const handleTypeError = () => {
    // 类型错误
    const obj = null as unknown as { foo: { bar: string } };
    console.log(obj.foo.bar); // 触发 TypeError
  };

  const handleReferenceError = () => {
    // 引用错误
    // @ts-expect-error 故意触发 ReferenceError
    console.log(nonExistentVariable);
  };

  // ===== 同步崩溃渲染 =====
  if (crashTriggered) {
    throw new Error("[SandboxDebug] Sync crash: render phase error");
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none flex flex-col p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Decorative Background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 z-10">
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600">
          🐛 Sandbox Debug
        </h1>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            测试工具
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Console Log Section */}
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

        {/* Crash Test Section */}
        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500/60">
            <Zap size={12} />
            崩溃测试 (Crash Tests) ⚠️
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-2">
            以下按钮会触发组件崩溃，用于测试 Sandbox 的错误捕获能力
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSyncCrash}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg transition-colors border border-red-500/30"
            >
              <XCircle size={14} />
              Sync Crash
            </button>
            <button
              type="button"
              onClick={handleAsyncCrash}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-600 dark:text-orange-400 rounded-lg transition-colors border border-orange-500/30"
            >
              <Zap size={14} />
              Async Crash
            </button>
            <button
              type="button"
              onClick={handleUnhandledRejection}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600 dark:text-yellow-400 rounded-lg transition-colors border border-yellow-500/30"
            >
              <AlertTriangle size={14} />
              Promise Reject
            </button>
            <button
              type="button"
              onClick={handleTypeError}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-600 dark:text-pink-400 rounded-lg transition-colors border border-pink-500/30"
            >
              <Bug size={14} />
              TypeError
            </button>
          </div>
          <button
            type="button"
            onClick={handleReferenceError}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs bg-violet-500/20 hover:bg-violet-500/30 text-violet-600 dark:text-violet-400 rounded-lg transition-colors border border-violet-500/30"
          >
            <Bug size={14} />
            ReferenceError
          </button>
        </div>

        {/* Status */}
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 pt-2">
          {config.enableAutoLog ? (
            <span className="text-green-500">✓ 自动日志已启用 (每3秒)</span>
          ) : (
            <span>自动日志已禁用</span>
          )}
        </div>
      </div>
    </div>
  );
}
