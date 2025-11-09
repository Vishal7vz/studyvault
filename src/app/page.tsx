import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 p-8 text-center">
      <Image src="/next.svg" alt="Logo" width={120} height={24} />
      <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-tight text-zinc-900">
        Your Smart Study Partner — Organize, Analyze & Revise with AI.
      </h1>
      <p className="max-w-2xl text-pretty text-lg text-zinc-600">
        Create subjects, upload notes (PDFs, images, text), run AI analysis for summaries & Q&A, manage to-dos and reminders — all in a beautiful dashboard.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/dashboard" className="rounded-full bg-zinc-900 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-zinc-800">
          Open Dashboard
        </Link>
        <a
          href="https://openrouter.ai"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/70 px-6 py-3 font-medium text-zinc-900 backdrop-blur-md ring-1 ring-zinc-200 transition hover:bg-white/90"
        >
          Learn about OpenRouter
        </a>
      </div>
    </main>
  );
}
