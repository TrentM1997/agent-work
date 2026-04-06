import { validateRequestBody } from "@/lib/utils/validationResult";
import { ChatRequestSchema } from "@/schemas/chatResponseSchema";
import { chat } from "@/server/lib/agent";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const validated = await validateRequestBody(req, ChatRequestSchema);

  if (!validated.ok) {
    return validated.response;
  }

  try {
    const result = await chat(validated.data.conversation);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Unexpected error during agent run", err);
    return NextResponse.json(
      { error: "Unexpected error during agent run" },
      { status: 500 },
    );
  }
}
