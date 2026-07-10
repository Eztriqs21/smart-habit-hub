"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, BASE_PATH } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/today";
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("[WellnessHub] OAuth exchange error:", exchangeError);
          setError("Failed to complete sign-in. Please try again.");
          return;
        }
        router.push(`${BASE_PATH}${next}`);
        return;
      }

      if (accessToken) {
        router.push(`${BASE_PATH}${next}`);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(`${BASE_PATH}${next}`);
      } else {
        setError("No authentication data found. Please try signing in again.");
      }
    };

    handleCallback();
  }, [searchParams, supabase, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-error-light flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-title text-foreground mb-2">Sign-in failed</h1>
          <p className="text-sm text-text-secondary mb-6">{error}</p>
          <a
            href={`${BASE_PATH}/auth/signin`}
            className="inline-flex items-center justify-center h-10 px-4 bg-primary text-white rounded-[10px] text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-sm text-text-secondary">Completing sign-in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-sm text-text-secondary">Loading...</p>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
