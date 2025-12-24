# Dailie Widget SDK Capabilities

This document describes the capabilities available to widgets via the `dailie-widget-sdk`.

## Core Imports

```typescript
import {
  defineWidget,
  useWidgetContext,
  useConfig,
  useStorage,
  widget,
  getSDKInfo
} from 'dailie-widget-sdk';
```

## 1. Widget Definition

Every widget must be defined using `defineWidget`. This provides metadata and handles the lifecycle.

```typescript
export default defineWidget({
  id: 'my-widget',
  version: '1.0.0',
  meta: {
    title: 'My Widget',
    description: 'A brief description',
    keywords: ['tag1', 'tag2']
  },
  config: {
    // JSON Schema for Properties (forms)
    props: { ... },
    // Panel Layout (visual representation)
    panel: { ... }
  },
  setup: (context) => {
     // Initialization logic
     return () => <MyWidgetComponent />;
  }
});
```

## 2. Hooks

### `useWidgetContext()`
Access environment information and state.

- `widgetId`: Unique identifier for the instance.
- `theme`: Current UI theme (`light` | `dark`).
- `gridSize`: Logical size on the canvas (e.g., `2x2`).
- `dimensions`: Actual pixel dimensions.
- `widgetStyle`: Visual mode (`classic` | `immersive`).
- `config`: Merged user configuration values.

### `useConfig<T>()`
Directly access the typed configuration values set by the user.

### `useStorage<T>(key: string, initialValue?: T)`
Stateful persistence scoped to the widget instance. Supports syncing with the host's `localStorage` layer.

## 3. Communication & Storage

### `widget.storage`
Direct API for storage interaction outside of React hooks.
Supports two areas:
- `local`: Persistent storage that survives browser restarts.
- `session`: Temporary storage tied to the current session.

Both areas support `getItem`, `setItem`, `removeItem`, and `clear`.

### `widget.ui`
Interact with the host's UI layer:
- `alert(message)`: Show a system alert.
- `confirm(message)`: Show a confirmation dialog.
- `toast.success/error/info/warning(message)`: Trigger system notifications.

## 4. Metadata & Diagnostics

### `getSDKInfo()`
Returns diagnostic information about the SDK, including version and whether it is bundled or external.

## 5. Best Practices
- **Isolation**: Don't use global `window` variables; use `useStorage`.
- **Reactivity**: Rely on `useConfig` and `useWidgetContext` for real-time updates (like resizing).
- **Themes**: Always check `context.theme` and `context.widgetStyle` for high-quality visuals.
