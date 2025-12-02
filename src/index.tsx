import { useWidgetContext, widget } from "dailie-widget-sdk";
import { useEffect, useState } from "react";

const Widget = () => {
  const { context, loading: contextLoading } = useWidgetContext();
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use nested storage.local
    widget.storage.local.getItem<number>("count")
      .then((val) => {
        setCount(val || 0);
        setLoading(false);
      });
  }, []);

  const handleIncrement = async () => {
    const newVal = count + 1;
    await widget.storage.local.setItem("count", newVal);
    setCount(newVal);
    await widget.ui.toast.success("Count incremented!");
  };

  const handleDecrement = async () => {
    const newVal = count - 1;
    await widget.storage.local.setItem("count", newVal);
    setCount(newVal);
    await widget.ui.toast.info("Count decremented");
  };

  const handleAlert = async () => {
    await widget.ui.alert("Current count is " + count);
  };

  if (contextLoading || loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:text-white">
      <h1 className="text-xl font-bold mb-2">Nested Modules Widget</h1>

      <div className="mb-4 text-sm text-gray-500">
        <p>Theme: {context?.theme}</p>
        <p>Size: {context?.dimensions.width}x{context?.dimensions.height}</p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleDecrement}
          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          -
        </button>
        <span className="text-2xl font-mono">{count}</span>
        <button
          onClick={handleIncrement}
          className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
        >
          +
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAlert}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Alert
        </button>
        <button
          onClick={() => widget.ui.toast.error("This is an error!")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Show Error
        </button>
      </div>
    </div>
  );
};

export default Widget;
