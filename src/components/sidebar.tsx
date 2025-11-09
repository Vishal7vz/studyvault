"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/subjects", label: "Subjects" },
  { href: "/ai", label: "AI Analyzer" },
  { href: "/todo", label: "To-Do" },
  { href: "/reminders", label: "Reminders" },
  { href: "/snaps", label: "Snaps" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 shrink-0 border-r border-zinc-200/60 bg-white/60 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/40">
      <div className="p-4 text-xl font-semibold">StudyVault AI</div>
      <nav className="flex flex-col gap-1 p-2">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
