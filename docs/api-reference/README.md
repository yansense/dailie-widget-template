# Dailie Widget SDK API Reference

Welcome to the comprehensive API reference for the Dailie Widget SDK. Use the links below to explore specific parts of the API.

## 📋 Table of Contents

### Core API
- **[defineWidget](define-widget.md)**: The entry point for every widget implementation. Defines metadata, configuration schemas, and the setup lifecycle.

### React Hooks
- **[Hooks](hooks.md)**: Standard hooks for accessing context and state within your widget components.
    - `useWidgetContext`: Access environment and environment state.
    - `useConfig`: Access user-provided configuration.
    - `useStorage`: Persist data scoped to the widget instance.

### Imperative Modules
- **[Storage Module](storage.md)**: Direct API for local and session storage interaction.
- **[UI Module](ui.md)**: Host-provided UI interactions like alerts, confirms, and toasts.

### Data Structures
- **[Types](types.md)**: Detailed TypeScript definitions for context, messages, and configurations.

---

## Getting Started
If you are new to developing widgets, we recommend starting with the **[SDK Capabilities](../sdk-capabilities.md)** guide for a high-level overview.
