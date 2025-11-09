import { NextRequest, NextResponse } from "next/server";
import { analyzeNotes, type AnalyzeTask } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const { content, task } = (await req.json()) as {
      content: string;
      task: AnalyzeTask;
    };

    if (!content || !task) {
      return NextResponse.json({ error: "Missing content or task" }, { status: 400 });
    }

    const result = await analyzeNotes(content, task);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
