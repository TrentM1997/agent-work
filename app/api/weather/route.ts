import { chat } from "@/lib/agent/chat";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const result = await chat();
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}
