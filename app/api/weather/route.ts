import { validateRequestBody } from "@/lib/utils/validationResult";
import { LocationRequestedSchema } from "@/schemas/weatherSchema";
import { chat } from "@/server/lib/agent/chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const validated = await validateRequestBody(req, LocationRequestedSchema);

  if (!validated.ok) {
    return validated.response;
  }

  try {
    const result = await chat(validated.data);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Unexpected error during agent run", err);
    return NextResponse.json(
      { error: "Unexpected error during agent run" },
      { status: 500 },
    );
  }
}
