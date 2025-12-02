// Mock SDK Bridge
window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || !data.id) return;

  console.log("[Host Mock] Received:", data);

  const sendResponse = (payload) => {
    window.postMessage(
      {
        id: data.id,
        type: "RESPONSE",
        payload,
      },
      "*"
    );
  };

  const sendError = (error) => {
    window.postMessage(
      {
        id: data.id,
        type: "ERROR",
        error,
      },
      "*"
    );
  };

  switch (data.type) {
    case "GET_CONTEXT":
      setTimeout(() => {
        sendResponse({
          theme: "light",
          dimensions: { width: 400, height: 300 },
          user: { id: "dev-user", name: "Developer" },
        });
      }, 500);
      break;

    case "INVOKE_METHOD": {
      const { module, method, args } = data.payload;
      
      // Handle nested modules (e.g. module="storage.local")
      if (module.startsWith("storage")) {
        // Determine storage type
        const type = module.includes("session") ? "session" : "local";
        const keyPrefix = `mock_${type}_`;
        
        if (method === "getItem") {
          const val = localStorage.getItem(keyPrefix + args[0]);
          sendResponse(val ? JSON.parse(val) : undefined);
        } else if (method === "setItem") {
          localStorage.setItem(keyPrefix + args[0], JSON.stringify(args[1]));
          sendResponse();
        } else if (method === "removeItem") {
          localStorage.removeItem(keyPrefix + args[0]);
          sendResponse();
        }
      } else if (module === "ui") {
        if (method === "alert") {
          alert("[Mock Alert] " + args[0]);
          sendResponse();
        } else if (method === "confirm") {
          const result = confirm("[Mock Confirm] " + args[0]);
          sendResponse(result);
        }
      } else if (module === "ui.toast") {
        console.log(`[Mock Toast] [${method}]`, args[0]);
        sendResponse();
      } else if (module === "network") {
         // Mock network
         console.log("[Mock Network]", method, args);
         sendResponse({});
      } else {
        sendError("Module not found: " + module);
      }
      break;
    }

    case "REQUEST":
      // Legacy
      console.log("[Host Mock] Requesting:", data.payload.url);
      fetch(data.payload.url, data.payload.options)
        .then((res) => res.json())
        .then((json) => sendResponse(json))
        .catch((err) => sendError(err.message));
      break;
  }
});

console.log("[Host Mock] Environment ready");
