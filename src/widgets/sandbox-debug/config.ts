import { z } from "zod";

export const WIDGET_CONFIG = {
  schema: z.object({
    general: z.object({
      enableAutoLog: z.boolean().default(false).describe("启用自动日志"),
      autoLogInterval: z.number().min(1).max(60).default(5).describe("日志间隔 (秒)"),
      theme: z.enum(["light", "dark", "auto"]).default("auto").describe("调试面板主题"),
    }).describe("核心配置"),
    
    network: z.object({
      endpoints: z.array(z.string().url()).default(["https://api.example.com"]).describe("受监控端点"),
      timeout: z.number().default(5000).describe("超时时间 (ms)"),
    }).describe("网络调试"),
    
    advanced: z.object({
      notifications: z.array(z.object({
        type: z.enum(["email", "push", "sms"]),
        target: z.string(),
        enabled: z.boolean().default(true),
      })).describe("通知规则"),
      lastMaintenance: z.date().optional().describe("上次维护时间"),
    }).optional().describe("高级选项"),
  }),
};

export const IO_SCHEMA = {
  input: z.object({
    message: z.string().optional().describe("Input message from host"),
    count: z.number().optional().describe("Input count from host"),
  }),
  output: z.object({
    status: z.string().describe("Status sent to host"),
    data: z.any().optional().describe("Data sent to host"),
  }),
};
