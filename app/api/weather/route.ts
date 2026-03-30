import {
  LocationRequestedSchema,
  LocationRequestedSchemaType,
} from "@/schemas/weatherSchema";
import { chat } from "@/server/lib/agent/chat";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  let locationRequested: LocationRequestedSchemaType;

  try {
    const body = await req.json();

    locationRequested = LocationRequestedSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: err.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const result = await chat(locationRequested);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Unexpected error during agent run", err);
    return NextResponse.json(
      { error: "Unexpected error during agent run" },
      { status: 500 },
    );
  }
}
