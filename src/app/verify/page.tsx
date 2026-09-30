"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/wallet-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  ShieldOff,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateEligibilityProof,
  type ProofResult,
} from "@/lib/midnight/circuit";
import { saveProofRecord } from "@/lib/midnight/proof-store";
import { generateRandomHex } from "@/lib/midnight/circuit";

type VerifyState = "idle" | "proving" | "success" | "failure";

const CAMPAIGN = {
  name: "Midnight Genesis Drop",
  requiredAmount: 1000,
  tokenSymbol: "tMIDN",
};

/** Simulated private balance — in production this comes from the wallet. */
const SIMULATED_BALANCE = 2500;

export default function VerifyPage() {
  const { status, displayAddress } = useWallet();
  const router = useRouter();

  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [proofResult, setProofResult] = useState<ProofResult | null>(null);
  const [copied, setCopied] = useState(false);

  const isConnected = status === "connected";

  async function handleGenerateProof() {
    setVerifyState("proving");

    try {
      const result = await generateEligibilityProof({
        privateTokenBalance: SIMULATED_BALANCE,
        requiredAmount: CAMPAIGN.requiredAmount,
      });

      setProofResult(result);
      setVerifyState(result.eligible ? "success" : "failure");

      // Persist to history
      saveProofRecord({
        id: generateRandomHex(16),
        timestamp: result.timestamp,
        campaign: CAMPAIGN.name,
        eligible: result.eligible,
        proofHash: result.proofHash,
      });
    } catch {
      setVerifyState("failure");
    }
  }

  function handleCopyProofHash() {
    if (!proofResult) return;
    navigator.clipboard.writeText(proofResult.proofHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Not connected ────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <ShieldOff className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Wallet not connected
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your wallet to generate a proof.
        </p>
        <Button
          size="sm"
          className="mt-5 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Verify Eligibility
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate a zero-knowledge proof for{" "}
          <span className="font-medium text-foreground/80">{CAMPAIGN.name}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Left: Privacy status panel ─────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Before proof card */}
          <Card
            className={cn(
              "border-border bg-card shadow-none transition-opacity",
              verifyState === "success" && "opacity-50"
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <EyeOff className="h-4 w-4" />
                Before Proof
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                <PrivacyRow label="Wallet Address" value="Hidden" hidden />
                <PrivacyRow label="Token Balance" value="Hidden" hidden />
                <PrivacyRow
                  label="Transaction History"
                  value="Hidden"
                  hidden
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Your private data is never transmitted or displayed.
              </p>
            </CardContent>
          </Card>

          {/* After proof card */}
          <Card
            className={cn(
              "border-border bg-card shadow-none transition-all",
              verifyState === "success" &&
                "border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/20",
              verifyState === "failure" &&
                "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/20",
              verifyState === "idle" && "opacity-50",
              verifyState === "proving" && "opacity-50"
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                After Proof
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verifyState === "success" || verifyState === "failure" ? (
                <div className="space-y-2.5">
                  <PrivacyRow
                    label="Eligibility"
                    value={proofResult?.eligible ? "Verified ✓" : "Not Eligible"}
                    verified={proofResult?.eligible}
                  />
                  <PrivacyRow label="Wallet Address" value="Still Hidden" hidden />
                  <PrivacyRow label="Token Balance" value="Still Hidden" hidden />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Proof result will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Proof action panel ──────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Campaign info */}
          <Card className="border-border bg-card shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">
                  {CAMPAIGN.name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  Active
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Threshold: {CAMPAIGN.requiredAmount.toLocaleString()}{" "}
                {CAMPAIGN.tokenSymbol} &middot; Connected as {displayAddress}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* ── Idle state ─────────────────────────────────── */}
              {verifyState === "idle" && (
                <div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Generate a private proof to check if you qualify. Your token
                    balance will be used inside the ZK circuit but never revealed.
                  </p>
                  <Button
                    className="w-full gap-2 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                    onClick={handleGenerateProof}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Generate Private Proof
                  </Button>
                </div>
              )}

              {/* ── Proving state ──────────────────────────────── */}
              {verifyState === "proving" && (
                <div className="flex flex-col items-center py-6">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-purple-200 dark:bg-purple-800 opacity-30" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Generating zero-knowledge proof…
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your private data stays local. Only the result is shared.
                  </p>
                </div>
              )}

              {/* ── Success state ──────────────────────────────── */}
              {verifyState === "success" && proofResult && (
                <div>
                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                        Eligible
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Your private information remains hidden.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg border border-border bg-muted p-3">
                    <ProofDetail label="Proof Hash">
                      <span className="font-mono text-xs text-foreground/70">
                        {proofResult.proofHash.slice(0, 18)}…
                      </span>
                      <button
                        onClick={handleCopyProofHash}
                        className="ml-1.5 text-muted-foreground transition-colors hover:text-foreground/70"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-green-500 dark:text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </ProofDetail>
                    <ProofDetail label="Verification Key">
                      <span className="font-mono text-xs text-foreground/70">
                        {proofResult.verificationKey.slice(0, 18)}…
                      </span>
                    </ProofDetail>
                    <ProofDetail label="Timestamp">
                      <span className="text-xs text-foreground/70">
                        {new Date(proofResult.timestamp).toLocaleString()}
                      </span>
                    </ProofDetail>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setVerifyState("idle");
                        setProofResult(null);
                      }}
                    >
                      New Proof
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                      onClick={() => router.push("/history")}
                    >
                      View History
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Failure state ──────────────────────────────── */}
              {verifyState === "failure" && (
                <div>
                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3">
                    <XCircle className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                        Not Eligible
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        You do not meet the threshold. Your data remains private.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVerifyState("idle");
                      setProofResult(null);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy assurance banner */}
          <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/40 px-4 py-3">
            <p className="text-xs leading-relaxed text-purple-700 dark:text-purple-300">
              <span className="font-medium">Privacy guarantee:</span> The ZK
              circuit runs locally. Your token balance is used as a secret
              witness and is never included in the proof output, transmitted to
              the network, or displayed in this interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function PrivacyRow({
  label,
  value,
  hidden,
  verified,
}: {
  label: string;
  value: string;
  hidden?: boolean;
  verified?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "flex items-center gap-1.5 font-medium",
          hidden && "text-muted-foreground",
          verified === true && "text-green-600 dark:text-green-400",
          verified === false && "text-red-500 dark:text-red-400"
        )}
      >
        {hidden && <EyeOff className="h-3 w-3" />}
        {verified === true && <CheckCircle2 className="h-3 w-3" />}
        {verified === false && <XCircle className="h-3 w-3" />}
        {value}
      </span>
    </div>
  );
}

function ProofDetail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}
