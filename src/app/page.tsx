"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ArrowRight,
  CheckCircle,
  Activity,
  Leaf,
  Flame,
  BarChart3,
  Sparkles,
  Zap,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function LandingContent() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* ─── Nav ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-strong bg-surface/70 border-b border-border/50 shadow-[var(--shadow-sm)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Wellness</span>Hub
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-28 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-subtle border border-primary/10 text-primary text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4" />
            Build habits that actually stick
          </div>
        </motion.div>

        <motion.h1
          className="text-hero max-w-4xl mb-6 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Your calm space for{" "}
          <span className="gradient-text">healthy habits</span>
          <br />& lasting wellness
        </motion.h1>

        <motion.p
          className="text-body-lg text-text-secondary max-w-xl mb-10 leading-relaxed relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Track habits across Body, Mind, and Lifestyle. Understand your patterns,
          build streaks, and create a balanced life — one day at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <Link href="/auth/signup">
            <Button size="lg" variant="glow" className="group text-base px-8">
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 flex items-center gap-6 text-sm text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-success" />
            Free forever
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-success" />
            No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-success" />
            30 seconds to start
          </span>
        </motion.div>
      </section>

      {/* ─── Features ─── */}
      <section className="px-6 lg:px-8 py-20 lg:py-28 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label text-primary mb-3 block">Features</span>
            <h2 className="text-display text-foreground">Everything you need</h2>
            <p className="text-body-lg text-text-secondary mt-3 max-w-lg mx-auto">
              Simple but powerful tools to help you build and maintain healthy habits.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {[
              {
                icon: Activity,
                title: "Track Daily",
                desc: "Simple checklists that take seconds. Binary and quantitative habits, all in one place.",
                color: "text-body-color",
                bg: "bg-body-light",
              },
              {
                icon: BarChart3,
                title: "Understand Patterns",
                desc: "Streaks, analytics, and insight cards reveal what works and what needs attention.",
                color: "text-mind-color",
                bg: "bg-mind-light",
              },
              {
                icon: Leaf,
                title: "Stay Balanced",
                desc: "Body, Mind, and Lifestyle dimensions give you a holistic view of your wellness.",
                color: "text-lifestyle-color",
                bg: "bg-lifestyle-light",
              },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i}>
                <Card hover className="p-7 h-full group">
                  <div
                    className={`w-12 h-12 rounded-[12px] ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-heading text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="px-6 lg:px-8 py-20 lg:py-28 bg-surface/50 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label text-accent mb-3 block">How it works</span>
            <h2 className="text-display text-foreground">Three steps to a better you</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 relative"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {[
              { step: "1", icon: Zap, title: "Choose your habits", desc: "Pick from templates or create your own. Set frequency, time, and difficulty." },
              { step: "2", icon: CheckCircle, title: "Show up daily", desc: "Check off habits each day. Watch your streaks grow and your scores improve." },
              { step: "3", icon: Flame, title: "See your progress", desc: "Analytics and insights show patterns across Body, Mind, and Lifestyle." },
            ].map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} custom={i} className="relative text-center">
                <div className="w-14 h-14 rounded-full gradient-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-5 relative z-10 shadow-[var(--shadow-glow)]">
                  {s.step}
                </div>
                <h3 className="text-heading text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Dimensions Showcase ─── */}
      <section className="px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label text-success mb-3 block">Dimensions</span>
            <h2 className="text-display text-foreground">Balance across three pillars</h2>
            <p className="text-body-lg text-text-secondary mt-3 max-w-lg mx-auto">
              Track your wellness holistically across Body, Mind, and Lifestyle.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {[
              {
                dim: "body",
                icon: "🏋️",
                label: "Body",
                desc: "Exercise, nutrition, sleep, hydration — the physical foundations.",
                color: "var(--body-color)",
                lightColor: "var(--body-light)",
              },
              {
                dim: "mind",
                icon: "🧠",
                label: "Mind",
                desc: "Meditation, reading, journaling — mental clarity and growth.",
                color: "var(--mind-color)",
                lightColor: "var(--mind-light)",
              },
              {
                dim: "lifestyle",
                icon: "🌿",
                label: "Lifestyle",
                desc: "Routines, social connection, creativity — the life around you.",
                color: "var(--lifestyle-color)",
                lightColor: "var(--lifestyle-light)",
              },
            ].map((d, i) => (
              <motion.div key={d.dim} variants={fadeUp} custom={i}>
                <Card hover className="p-7 group">
                  <div
                    className="w-14 h-14 rounded-[14px] flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: d.lightColor }}
                  >
                    {d.icon}
                  </div>
                  <h3
                    className="text-heading mb-2"
                    style={{ color: d.color }}
                  >
                    {d.label}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{d.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 lg:px-8 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <motion.div
          className="max-w-2xl mx-auto text-center relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-display text-foreground mb-4">
            Ready to transform your habits?
          </h2>
          <p className="text-body-lg text-text-secondary mb-8">
            Join WellnessHub and start building the life you want — one habit at a time.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="glow" className="group text-base px-8">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-6 lg:px-8 py-12 border-t border-border bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-bold">
                  <span className="text-primary">Wellness</span>Hub
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                Build healthy habits across Body, Mind, and Lifestyle.
                Your calm space for lasting wellness.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link href="/auth/signup" className="hover:text-primary transition-colors">Get Started</Link></li>
                <li><Link href="/auth/signin" className="hover:text-primary transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><span className="cursor-default">Privacy Policy</span></li>
                <li><span className="cursor-default">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} WellnessHub. All rights reserved.
            </p>
            <p className="text-xs text-text-muted">Built with care for your wellbeing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return <LandingContent />;
}
