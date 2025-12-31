import { useIO } from "dailie-widget-sdk";

export function IOControls() {
  const { inputs, setOutput } = useIO<{ message?: string; count?: number }, { status: string; data?: any }>();

  const handleSendOutput = () => {
    setOutput({
      status: "success",
      data: { timestamp: Date.now(), message: "Hello from Sandbox!" }
    });
  };

  return (
    <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-3 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          IO Testing
        </h3>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between p-2 bg-zinc-100 dark:bg-zinc-900 rounded">
          <span className="text-zinc-500">Input Message:</span>
          <span className="font-mono text-purple-600 dark:text-purple-400">
            {inputs.message || "undefined"}
          </span>
        </div>
        <div className="flex justify-between p-2 bg-zinc-100 dark:bg-zinc-900 rounded">
          <span className="text-zinc-500">Input Count:</span>
          <span className="font-mono text-blue-600 dark:text-blue-400">
            {inputs.count !== undefined ? inputs.count : "undefined"}
          </span>
        </div>
      </div>

      <button
        onClick={handleSendOutput}
        className="w-full mt-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white text-xs font-medium rounded transition-colors"
      >
        Send Output to Host
      </button>
    </div>
  );
}
