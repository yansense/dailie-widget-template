import { useState } from 'react';
import { Zap, XCircle, AlertTriangle, Bug } from "lucide-react";

export const CrashControls = () => {
  const [crashTriggered, setCrashTriggered] = useState(false);

  const handleSyncCrash = () => setCrashTriggered(true);
  const handleAsyncCrash = () => {
    setTimeout(() => {
      throw new Error("[SandboxDebug] Async crash: setTimeout error");
    }, 100);
  };
  const handleUnhandledRejection = () => {
    Promise.reject(new Error("[SandboxDebug] Unhandled Promise rejection test"));
  };
  const handleTypeError = () => {
    const obj = null as any;
    console.log(obj.foo.bar);
  };
  const handleReferenceError = () => {
    // @ts-expect-error
    console.log(nonExistentVariable);
  };

  if (crashTriggered) {
    throw new Error("[SandboxDebug] Sync crash: render phase error");
  }

  return (
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
  );
};
