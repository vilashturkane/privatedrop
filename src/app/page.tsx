"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Fingerprint,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: EyeOff,
    title: "Zero Knowledge",
    description:
      "Prove eligibility without revealing your wallet address, balance, or transaction history.",
  },
  {
    icon: Lock,
    title: "On-Chain Privacy",
    description:
      "Powered by Midnight Network's privacy-preserving smart contracts and ZK circuits.",
  },
  {
    icon: Fingerprint,
    title: "Verifiable Proofs",
    description:
      "Generate cryptographic proofs that anyone can verify but no one can trace back to you.",
  },
];

const comparisonBefore = [
  "Wallet address exposed",
  "Token balance visible",
  "Transaction history public",
];

const comparisonAfter = [
  "Identity stays private",
  "Balance never revealed",
  "No on-chain footprint",
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-50/80 via-background to-background dark:from-purple-950/20" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-28 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/40">
            <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>

          <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Private Airdrop Verification
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Prove eligibility without exposing your wallet.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
              )}
            >
              Connect Lace Wallet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Midnight Preprod &middot; Lace Wallet required
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border-border bg-card shadow-none transition-shadow hover:shadow-sm"
            >
              <CardContent className="pt-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/30">
                  <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Privacy comparison */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-border bg-muted/50 p-8 sm:p-10">
          <h2 className="mb-6 text-center text-lg font-semibold tracking-tight text-foreground">
            Traditional vs. PrivateDrop
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Before */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Traditional Airdrop
                </span>
              </div>
              <ul className="space-y-3">
                {comparisonBefore.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 text-red-400 dark:text-red-500">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-6 dark:border-purple-800 dark:bg-purple-950/30">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  PrivateDrop
                </span>
              </div>
              <ul className="space-y-3">
                {comparisonAfter.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-foreground/80"
                  >
                    <span className="mt-0.5 text-purple-600 dark:text-purple-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
