import { ZodError, ZodSchema } from "zod";
import { NextResponse } from "next/server";

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

export async function validateRequestBody<T>(
  req: Request,
  schema: ZodSchema<T>,
): Promise<ValidationResult<T>> {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    return { ok: true, data };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Invalid request body", details: err.flatten() },
          { status: 400 },
        ),
      };
    }

    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      ),
    };
  }
}
