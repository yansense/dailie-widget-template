import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
        Count: {count}
      </h1>
      <div className="flex space-x-3">
        <button
          onClick={() => setCount(count - 1)}
          className="flex items-center justify-center p-2 text-white bg-gradient-to-r from-red-400 to-pink-400 shadow-md hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-md"
        >
          <MinusCircle size={20} />
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="flex items-center justify-center p-2 text-white bg-gradient-to-r from-blue-400 to-indigo-400 shadow-md hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-md"
        >
          <PlusCircle size={20} />
        </button>
      </div>
    </div>
  );
}