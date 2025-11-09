export type AnalyzeTask = "summarize" | "qa" | "explain";

export async function analyzeNotes(content: string, task: AnalyzeTask) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const base = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  const model = process.env.OPENROUTER_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const system =
    task === "summarize"
      ? "Summarize the provided study notes into concise bullet points."
      : task === "qa"
      ? "Generate likely exam questions and short answers based on the notes."
      : "Explain the toughest concepts from the notes with clear examples.";

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message?.content || "";
  return { output: message } as { output: string };
}
