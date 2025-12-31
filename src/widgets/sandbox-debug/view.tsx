import { useConfig } from "dailie-widget-sdk";
import { useEffect } from "react";
import { ConsoleControls } from "./components/ConsoleControls";
import { CrashControls } from "./components/CrashControls";
import { ConfigDisplay } from "./components/ConfigDisplay";
import { IOControls } from "./components/IOControls";

interface DebugConfig {
  general: {
    enableAutoLog: boolean;
    autoLogInterval: number;
    theme: 'light' | 'dark' | 'auto';
  };
  network: {
    endpoints: string[];
    timeout: number;
  };
  advanced?: {
    notifications: Array<{
      type: 'email' | 'push' | 'sms';
      target: string;
      enabled: boolean;
    }>;
    lastMaintenance?: Date;
  };
}

interface SandboxDebugViewProps {
  widgetStyle?: 'classic' | 'immersive';
}

export function SandboxDebugView({ widgetStyle = 'classic' }: SandboxDebugViewProps) {
  const config = useConfig<DebugConfig>();

  // 自动日志测试
  useEffect(() => {
    if (config.general?.enableAutoLog) {
      const intervalMs = (config.general.autoLogInterval || 5) * 1000;
      const interval = setInterval(() => {
        console.log("[SandboxDebug] Auto log tick:", new Date().toISOString());
      }, intervalMs);
      return () => clearInterval(interval);
    }
  }, [config.general?.enableAutoLog, config.general?.autoLogInterval]);

  const backgroundClass = widgetStyle === 'classic'
    ? 'bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950'
    : 'bg-transparent';

  return (
    <div className={`w-full h-full relative overflow-hidden select-none flex flex-col p-4 ${backgroundClass} text-zinc-900 dark:text-zinc-100 font-sans`}>
      {/* Decorative Background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 z-10">
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600">
          🐛 Sandbox Debug
        </h1>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            测试工具 v2
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        <ConsoleControls />

        <CrashControls />

        <IOControls />

        <ConfigDisplay config={config} />

        {/* Status */}
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 pt-2 pb-4">
          {config.general?.enableAutoLog ? (
            <span className="text-green-500 font-medium">✓ 自动日志已启用 (每 {config.general.autoLogInterval} 秒)</span>
          ) : (
            <span>自动日志已禁用</span>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(155, 155, 155, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
