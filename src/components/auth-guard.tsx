"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-zinc-500">Loading...</div>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}
