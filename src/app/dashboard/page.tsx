"use client";

import Link from "next/link";
import { useWallet } from "@/context/wallet-context";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Wallet,
  ShieldCheck,
  ArrowRight,
  Radio,
  AlertTriangle,
  Coins,
} from "lucide-react";

export default function DashboardPage() {
  const { status, displayAddress, isSimulated, connect } = useWallet();

  const isConnected = status === "connected";

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your wallet and check your airdrop eligibility privately.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* ── Wallet Status Card ──────────────────────────────────── */}
        <Card className="border-border bg-card shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Wallet
              </CardTitle>
              {isConnected ? (
                <Badge
                  variant="outline"
                  className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                >
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-green-500" />
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground"
                >
                  Disconnected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div>
                <p className="font-mono text-sm font-medium text-foreground">
                  {displayAddress}
                </p>
                {isSimulated && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    Simulated mode — Lace wallet not detected
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="mb-3 text-sm text-muted-foreground">
                  No wallet connected yet.
                </p>
                <Button
                  size="sm"
                  className="bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                  onClick={connect}
                >
                  Connect Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Airdrop Campaign Card ──────────────────────────────── */}
        <Card className="border-border bg-card shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Coins className="h-4 w-4" />
                Airdrop Campaign
              </CardTitle>
              <Badge
                variant="outline"
                className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              >
                <Radio className="mr-1.5 h-3 w-3" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">
              Midnight Genesis Drop
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reward early adopters who hold ≥ 1,000 tMIDN on Preprod.
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                Threshold:{" "}
                <span className="font-medium text-foreground/70">1,000 tMIDN</span>
              </span>
              <span>
                Network:{" "}
                <span className="font-medium text-foreground/70">Preprod</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ── Eligibility Checker Card ───────────────────────────── */}
        <Card
          className={cn(
            "border-border bg-card shadow-none sm:col-span-2 lg:col-span-1",
            isConnected && "border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/20"
          )}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Eligibility Checker
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div>
                <p className="mb-4 text-sm text-foreground/70">
                  Generate a zero-knowledge proof to verify your eligibility
                  without revealing any private data.
                </p>
                <Link
                  href="/verify"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "gap-1.5 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                  )}
                >
                  Check Eligibility
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to check airdrop eligibility.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Privacy reminder ──────────────────────────────────────── */}
      <div className="mt-8 rounded-xl border border-border bg-muted/50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Your privacy is protected
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              PrivateDrop uses Midnight Network&apos;s zero-knowledge circuits.
              Your wallet address, token balance, and transaction history are
              never exposed — only the proof result is shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
