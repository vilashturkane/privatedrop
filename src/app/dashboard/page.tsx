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
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect your wallet and check your airdrop eligibility privately.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* ── Wallet Status Card ──────────────────────────────────── */}
        <Card className="border-gray-100 bg-white shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Wallet className="h-4 w-4" />
                Wallet
              </CardTitle>
              {isConnected ? (
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-green-500" />
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-gray-200 text-gray-400"
                >
                  Disconnected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div>
                <p className="font-mono text-sm font-medium text-gray-900">
                  {displayAddress}
                </p>
                {isSimulated && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    Simulated mode — Lace wallet not detected
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="mb-3 text-sm text-gray-400">
                  No wallet connected yet.
                </p>
                <Button
                  size="sm"
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  onClick={connect}
                >
                  Connect Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Airdrop Campaign Card ──────────────────────────────── */}
        <Card className="border-gray-100 bg-white shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Coins className="h-4 w-4" />
                Airdrop Campaign
              </CardTitle>
              <Badge
                variant="outline"
                className="border-purple-200 bg-purple-50 text-purple-700"
              >
                <Radio className="mr-1.5 h-3 w-3" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-gray-900">
              Midnight Genesis Drop
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Reward early adopters who hold ≥ 1,000 tMIDN on Preprod.
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              <span>
                Threshold:{" "}
                <span className="font-medium text-gray-600">1,000 tMIDN</span>
              </span>
              <span>
                Network:{" "}
                <span className="font-medium text-gray-600">Preprod</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ── Eligibility Checker Card ───────────────────────────── */}
        <Card
          className={cn(
            "border-gray-100 bg-white shadow-none sm:col-span-2 lg:col-span-1",
            isConnected && "border-purple-100 bg-purple-50/30"
          )}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <ShieldCheck className="h-4 w-4" />
              Eligibility Checker
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div>
                <p className="mb-4 text-sm text-gray-600">
                  Generate a zero-knowledge proof to verify your eligibility
                  without revealing any private data.
                </p>
                <Link
                  href="/verify"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "gap-1.5 bg-purple-600 text-white hover:bg-purple-700"
                  )}
                >
                  Check Eligibility
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400">
                  Connect your wallet to check airdrop eligibility.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Privacy reminder ──────────────────────────────────────── */}
      <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Your privacy is protected
            </p>
            <p className="mt-0.5 text-sm text-gray-500">
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
