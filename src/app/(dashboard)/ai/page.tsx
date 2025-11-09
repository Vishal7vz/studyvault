"use client";
import { useState } from "react";

export default function AIPage() {
  const [content, setContent] = useState("");
  const [task, setTask] = useState("summarize");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setOutput("");
    const res = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, task }),
    });
    const data = await res.json();
    setLoading(false);
    if (data?.output) setOutput(data.output);
    else setOutput(data?.error || "Error");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">AI Analyzer</h1>
      <div className="grid gap-3">
        <select
          className="rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        >
          <option value="summarize">Summarize</option>
          <option value="qa">Q&A</option>
          <option value="explain">Explain</option>
        </select>
        <textarea
          className="min-h-40 rounded-md border border-zinc-300 bg-white p-3 outline-none dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Paste your notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={run}
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {loading ? "Analyzing..." : "Run"}
        </button>
      </div>
      {output && (
        <pre className="whitespace-pre-wrap rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          {output}
        </pre>
      )}
    </div>
  );
}
