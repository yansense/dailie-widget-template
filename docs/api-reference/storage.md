# Storage Module (`widget.storage`)

The `storage` module provides an imperative API for interacting with persisted data. This is useful in utility functions or outside of React's render cycle.

## Storage Areas

The module is divided into two areas:

### `local`
Persistent storage that survives page reloads and browser restarts. Maps to the host's `localStorage` API but is scoped to the specific widget instance.

### `session`
Temporary storage that exists only for the duration of the current session.

---

## Methods

All methods are asynchronous and return a `Promise`.

### `getItem<T>(key: string): Promise<T | undefined>`
Retrieves a value from the specified storage area.

### `setItem<T>(key: string, value: T): Promise<void>`
Stores a value. The value is automatically serialized to JSON.

### `removeItem(key: string): Promise<void>`
Removes a specific key and its value.

### `clear(): Promise<void>`
Clears all data within the scope of the current widget instance for that storage area.

---

## Example

```typescript
import { widget } from 'dailie-widget-sdk';

async function logVisit() {
  const visits = (await widget.storage.local.getItem<number>('visits')) || 0;
  await widget.storage.local.setItem('visits', visits + 1);
}
```
