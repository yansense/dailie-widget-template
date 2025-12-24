# defineWidget

The `defineWidget` function is the mandatory entry point for all Dailie widgets. it handles metadata registration and wraps your component in the necessary providers.

## Signature

```typescript
function defineWidget(definition: WidgetDefinition): void;
```

## `WidgetDefinition` Object

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for your widget type (e.g., `weather-card`). |
| `version` | `string` | Version of your widget (SemVer). |
| `meta` | `object` | (Optional) Meta information like `title`, `description`, and `keywords`. |
| `config` | `object` | Defines the widget's configuration via a Zod `schema`. |
| `setup` | `function` | Lifecycle function that receives `context` and returns the root component renderer. |

### The `setup` Function

The `setup` function is called once when the widget instance is initialized.

```typescript
setup: (context: WidgetContext) => {
  // Initialization logic (e.g., pre-fetching data)
  return () => <MyComponent />;
}
```

### `context` Parameter
The `context` provided to `setup` is a **scoped** version of the SDK, including:
- All environment variables (`widgetId`, `theme`, etc.).
- Pre-bound `ui` and `storage` modules for that specific instance.

---

## Example

```typescript
import { defineWidget } from 'dailie-widget-sdk';

export default defineWidget({
  id: 'hello-world',
  version: '1.0.0',
  setup: (context) => {
    console.log('Widget initialized with ID:', context.widgetId);
    return () => <div>Hello, {context.theme} mode!</div>;
  }
});
```
