# UI Module (`widget.ui`)

The `ui` module allows widgets to trigger system-level UI interactions provided by the Dailie host.

## Methods

### `alert(message: string): Promise<void>`
Displays a standard system alert dialog with an "OK" button.

### `confirm(message: string): Promise<boolean>`
Displays a confirmation dialog with "Cancel" and "OK" buttons. Returns `true` if the user clicked "OK".

---

## `toast` Sub-module

Provides non-intrusive notifications.

### Methods
Each method accepts a `message: string` and returns a `Promise<void>`.

- `widget.ui.toast.success(message)`
- `widget.ui.toast.error(message)`
- `widget.ui.toast.info(message)`
- `widget.ui.toast.warning(message)`

---

## Example

```typescript
import { widget } from 'dailie-widget-sdk';

async function handleDelete() {
  const confirmed = await widget.ui.confirm('Are you sure you want to delete this?');
  if (confirmed) {
    // ... logic
    widget.ui.toast.success('Successfully deleted');
  }
}
```
