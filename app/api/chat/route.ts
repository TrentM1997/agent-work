import { streamText, UIMessage, convertToModelMessages } from "ai";

//TODO: look into how we ought to set a 'keep alive' status for streaming text responses from ai SDK

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
