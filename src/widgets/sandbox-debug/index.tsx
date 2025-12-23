import { defineWidget } from "dailie-widget-sdk";
import { WIDGET_CONFIG } from "./config";
import { SandboxDebugView } from "./view";

export default defineWidget({
  id: "sandbox.debug",
  version: "1.0.0",
  meta: {
    title: "Sandbox Debug",
    description: "用于测试 Sandbox 的日志拦截和崩溃捕获能力",
  },
  config: WIDGET_CONFIG,
  setup() {
    return () => <SandboxDebugView />;
  },
});
