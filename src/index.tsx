import { useStorage, useWidgetContext } from "dailie-widget-sdk";


const Widget = () => {
  const { context, loading: contextLoading } = useWidgetContext();
  const { value: count, setValue: setCount, loading: storageLoading } = useStorage<number>("count", 0);

  if (contextLoading || storageLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:text-white">
      <h1 className="text-xl font-bold mb-2">Hello Widget</h1>

      <div className="mb-4 text-sm text-gray-500">
        <p>Theme: {context?.theme}</p>
        <p>Size: {context?.dimensions.width}x{context?.dimensions.height}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount((count || 0) - 1)}
          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          -
        </button>
        <span className="text-2xl font-mono">{count}</span>
        <button
          onClick={() => setCount((count || 0) + 1)}
          className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Widget;
