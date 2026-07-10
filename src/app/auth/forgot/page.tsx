"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient, BASE_PATH } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/providers/ToastProvider";
import { CheckCircle } from "lucide-react";

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
      redirectTo: `${window.location.origin}${BASE_PATH}/auth/signin`,
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
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-[380px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-xl font-bold">
            <span className="text-primary">Wellness</span>Hub
          </Link>
        </div>

        <h1 className="text-title text-foreground mb-1">Reset password</h1>
        <p className="text-sm text-text-secondary mb-8">
          {sent
            ? "We sent a reset link to your email."
            : "Enter your email and we'll send you a reset link."}
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Check <span className="font-medium text-foreground">{email}</span> for the reset link.
            </p>
            <Link href={`${BASE_PATH}/auth/signin`}>
              <Button variant="secondary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </motion.div>
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
            <Button type="submit" isLoading={isLoading} variant="glow" className="w-full mt-1">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href={`${BASE_PATH}/auth/signin`} className="text-sm text-text-secondary hover:text-primary transition-colors">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
