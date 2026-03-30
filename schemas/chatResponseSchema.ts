import z from "zod";

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

export type ChatResponseSchemaType = z.infer<typeof ChatResponseSchema>;
