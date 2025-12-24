import { Settings } from "lucide-react";

export const ConfigDisplay = ({ config }: { config: any }) => {
  return (
    <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
        <Settings size={12} />
        当前配置 (Current Config)
      </div>
      <pre className="text-[10px] p-3 bg-zinc-950 text-green-400 rounded-xl overflow-x-auto max-h-40 font-mono border border-white/5">
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
};
