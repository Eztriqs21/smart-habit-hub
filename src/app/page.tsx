"use client";

import Link from "next/link";
import { Providers } from "@/providers";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle, Brain, Activity, Leaf } from "lucide-react";

function LandingContent() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 h-16 border-b border-border">
        <span className="text-xl font-bold">
          <span className="text-primary">Wellness</span>Hub
        </span>
        <div className="flex items-center gap-3">
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary text-[13px] font-medium mb-6">
          <CheckCircle className="w-3.5 h-3.5" />
          Build habits that last
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-foreground max-w-3xl leading-tight mb-6">
          Your calm space for<br />
          <span className="text-primary">healthy habits</span> & wellness
        </h1>
        <p className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed">
          Track habits across Body, Mind, and Lifestyle. See your streaks, understand your patterns, and build a balanced life — one day at a time.
        </p>
        <Link href="/auth/signup">
          <Button size="lg" className="group">
            Start Your Journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 border-t border-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Activity, title: "Track Daily", desc: "Simple daily checklists that take seconds. Binary and quantitative habits supported." },
            { icon: Brain, title: "Understand Patterns", desc: "Streaks, heatmaps, and insight cards reveal what's working and what needs attention." },
            { icon: Leaf, title: "Stay Balanced", desc: "Body, Mind, and Lifestyle dimensions give you a holistic view of your wellness." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-[10px] bg-primary-subtle flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-border text-center">
        <p className="text-sm text-text-muted">WellnessHub — Build habits that last.</p>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Providers>
      <LandingContent />
    </Providers>
  );
}
