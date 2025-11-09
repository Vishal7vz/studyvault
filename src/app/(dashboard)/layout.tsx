import type { ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import AuthGuard from "@/components/auth-guard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen p-4">
      <div className="flex w-full rounded-2xl bg-white/60 shadow-2xl backdrop-blur-xl">
        <Sidebar />
        <main className="flex-1 p-6">
          <AuthGuard>
            {children}
          </AuthGuard>
        </main>
      </div>
    </div>
  );
}
