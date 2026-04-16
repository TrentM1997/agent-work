import { validateRequestBody } from "@/lib/utils/validationResult";
import { ChatRequestSchema } from "@/schemas/chatResponseSchema";
import { chatStream } from "@/server/lib/agent";

export async function POST(req: Request) {
  const validated = await validateRequestBody(req, ChatRequestSchema);

  if (!validated.ok) {
    return validated.response;
  }

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of chatStream(validated.data.conversation)) {
            controller.enqueue(encoder.encode(chunk));
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    console.error("Unexpected error during agent run", err);
    return Response.json(
      { ok: false, error: "Unexpected error during agent run" },
      { status: 500 },
    );
  }
}
