"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signin") await signInWithEmail(email, password);
      else await signUpWithEmail(email, password);
      router.replace(next);
    } catch (err: any) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.replace(next);
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold">StudyVault AI — Login</h1>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mb-4 w-full rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <div className="my-4 text-center text-sm text-zinc-500">or</div>

        <form onSubmit={handleEmailAuth} className="grid gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border border-zinc-300 bg-white p-2 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md border border-zinc-300 bg-white p-2 outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-600">
          {mode === "signin" ? (
            <button onClick={() => setMode("signup")} className="underline">
              Create an account
            </button>
          ) : (
            <button onClick={() => setMode("signin")} className="underline">
              Have an account? Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-zinc-500">Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
}
