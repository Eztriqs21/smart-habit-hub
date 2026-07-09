"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Providers } from "@/providers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/providers/ToastProvider";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/signin`,
    });

    if (error) {
      showToast(error.message, "error");
    } else {
      setSent(true);
      showToast("Check your email for the reset link.", "success");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-primary">Wellness</span>Hub
          </Link>
          <h1 className="text-xl font-semibold text-foreground mt-6 mb-2">Reset password</h1>
          <p className="text-sm text-text-secondary">
            {sent
              ? "We sent a reset link to your email."
              : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <Link href="/auth/signin">
              <Button variant="secondary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-sm text-primary hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Providers>
      <ForgotPasswordContent />
    </Providers>
  );
}
