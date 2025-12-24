# SDK Hooks

Hooks are the primary way to interact with the Dailie environment from within your React components.

## `useWidgetContext()`

Accesses the global state of the widget instance and environment.

### Returns
An object containing:
- `context`: The `WidgetContext` object.
- `loading`: Boolean indicating if the context is being initialized.
- `error`: Any error that occurred during initialization.

---

## `useConfig<T>()`

A specialized hook to access user configuration values defined in the widget's `props` schema.

### Returns
- `T`: The typed configuration object.

---

## `useStorage<T>(key: string, initialValue?: T)`

Manages state that is automatically persisted to the host's `localStorage` layer.

### Parameters
- `key`: The unique key to store the data under (scoped to the widget instance).
- `initialValue`: (Optional) The value to use if no data exists in storage.

### Returns
An object containing:
- `value`: The current stored value (or `initialValue`).
- `setValue`: (Async) Function to update the stored value.
- `loading`: Boolean indicating if the value is being loaded from the host.
- `error`: Any error encountered during persistence.
