# Types & Data Structures

This page documents the TypeScript interfaces and types used throughout the Dailie Widget SDK.

## `WidgetContext`

The context object provides environmental information to the widget.

```typescript
interface WidgetContext {
  widgetId: string;           // Unique instance ID
  theme: 'light' | 'dark';    // Current host theme
  gridSize: string;           // Logical size (e.g., "2x4")
  dimensions: {
    width: number;            // Actual width in pixels
    height: number;           // Actual height in pixels
  };
  widgetStyle: 'classic' | 'immersive'; // Background mode
  config: any;                // Merged user configuration
}
```

## `WidgetDefinition`

Used in `defineWidget` to register the widget.

```typescript
interface WidgetDefinition {
  id: string;
  version: string;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  config?: {
    props?: Record<string, any>; // JSON Schema
    panel?: Record<string, any>; // VDOM Layout
  };
  setup: (context: WidgetContext) => () => React.ReactNode;
}
```

## Storage Interfaces

### `StorageArea`
```typescript
interface StorageArea {
  getItem<T>(key: string): Promise<T | undefined>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

### `StorageAPI`
```typescript
interface StorageAPI {
  local: StorageArea;
  session: StorageArea;
}
```

## UI Interfaces

### `UiAPI`
```typescript
interface UiAPI {
  alert(message: string): Promise<void>;
  confirm(message: string): Promise<boolean>;
  toast: {
    success(message: string): Promise<void>;
    error(message: string): Promise<void>;
    info(message: string): Promise<void>;
    warning(message: string): Promise<void>;
  };
}
```
