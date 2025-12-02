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

    case "GET_STORAGE":
      const storedValue = localStorage.getItem(`widget_storage_${data.payload.key}`);
      sendResponse(storedValue ? JSON.parse(storedValue) : undefined);
      break;

    case "SET_STORAGE":
      localStorage.setItem(
        `widget_storage_${data.payload.key}`,
        JSON.stringify(data.payload.value)
      );
      sendResponse(true);
      break;

    case "REQUEST":
      console.log("[Host Mock] Requesting:", data.payload.url);
      fetch(data.payload.url, data.payload.options)
        .then((res) => res.json())
        .then((json) => sendResponse(json))
        .catch((err) =>
          window.postMessage(
            { id: data.id, type: "ERROR", error: err.message },
            "*"
          )
        );
      break;
  }
});

console.log("[Host Mock] Environment ready");
