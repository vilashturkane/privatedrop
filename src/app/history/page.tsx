"use client";

import { useEffect, useState } from "react";
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
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ScrollText,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProofRecord } from "@/types";
import {
  getProofHistory,
  clearProofHistory,
} from "@/lib/midnight/proof-store";

export default function HistoryPage() {
  const { status } = useWallet();
  const router = useRouter();

  const [records, setRecords] = useState<ProofRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isConnected = status === "connected";

  useEffect(() => {
    setRecords(getProofHistory().slice().reverse());
  }, []);

  function handleClear() {
    clearProofHistory();
    setRecords([]);
  }

  function handleCopyHash(record: ProofRecord) {
    navigator.clipboard.writeText(record.proofHash);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // ── Not connected ────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
          <ShieldOff className="h-6 w-6 text-gray-400" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Wallet not connected
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect your wallet to view proof history.
        </p>
        <Button
          size="sm"
          className="mt-5 bg-purple-600 text-white hover:bg-purple-700"
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
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Proof History
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Previous zero-knowledge proof attempts.{" "}
            <span className="text-gray-400">
              No private data is stored or displayed.
            </span>
          </p>
        </div>

        {records.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-gray-400 hover:text-red-500"
            onClick={handleClear}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* ── Empty state ────────────────────────────────────────── */}
      {records.length === 0 && (
        <Card className="border-gray-100 bg-white shadow-none">
          <CardContent className="flex flex-col items-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
              <ScrollText className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No proofs yet
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Generate your first eligibility proof to see it here.
            </p>
            <Button
              size="sm"
              className="mt-5 gap-1.5 bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => router.push("/verify")}
            >
              Generate Proof
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Proof list ─────────────────────────────────────────── */}
      {records.length > 0 && (
        <div className="space-y-3">
          {records.map((record) => (
            <Card
              key={record.id}
              className={cn(
                "border-gray-100 bg-white shadow-none transition-colors",
                record.eligible
                  ? "hover:border-green-200"
                  : "hover:border-red-200"
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    {record.campaign}
                  </CardTitle>
                  {record.eligible ? (
                    <Badge
                      variant="outline"
                      className="gap-1 border-green-200 bg-green-50 text-green-700"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Eligible
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1 border-red-200 bg-red-50 text-red-600"
                    >
                      <XCircle className="h-3 w-3" />
                      Not Eligible
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {new Date(record.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
                    <span className="font-mono text-xs text-gray-500">
                      {record.proofHash.slice(0, 24)}…
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyHash(record)}
                    className="text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {copiedId === record.id ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Private inputs were not stored. Only the proof result is
                  recorded.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
