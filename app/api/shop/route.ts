import { generateText } from "ai";
import { NextResponse } from "next/server";

type ShopMacbooksRequest = {
  prompt: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as ShopMacbooksRequest;

  try {
    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4.6",
      prompt: body.prompt,
    });

    return NextResponse.json(text, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
