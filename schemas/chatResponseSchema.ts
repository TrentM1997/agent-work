import { MCP_PROTOCOL_VERSION } from "@/server/lib/init/mcpProtocolVersion";
import z from "zod";

export const ConversationMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

export const ChatRequestSchema = z.object({
  conversation: z.array(ConversationMessageSchema).min(1),
});

export const ChatResponseSchema = z.union([
  z.object({
    ok: z.literal(true),
    message: z.string(),
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

export const ToolRequestSchema = z.object({
  tool_name: z.string().min(1),
  parameters: z.record(z.string(), z.unknown()),
});

export const McpImplementationSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
});

export const McpInitializeResultSchema = z.object({
  protocolVersion: z.literal(MCP_PROTOCOL_VERSION),
  capabilities: z.record(z.string(), z.unknown()),
  serverInfo: McpImplementationSchema,
  instructions: z.string().optional(),
});

export type McpInitializeResult = z.infer<typeof McpInitializeResultSchema>;

export type ConversationMessageSchemaType = z.infer<
  typeof ConversationMessageSchema
>;

export type ChatRequestSchemaType = z.infer<typeof ChatRequestSchema>;

export type ToolRequestSchemaType = z.infer<typeof ToolRequestSchema>;

export type ChatResponseSchemaType = z.infer<typeof ChatResponseSchema>;
