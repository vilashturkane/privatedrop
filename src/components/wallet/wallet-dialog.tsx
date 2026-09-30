"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@/context/wallet-context";
import { LACE_INSTALL_URL } from "@/lib/wallet/lace";
import { ShieldCheck, ExternalLink, Play, Loader2 } from "lucide-react";

export function WalletDialog() {
  const { showLacePrompt, dismissLacePrompt, connectDemo, status } =
    useWallet();

  const isConnecting = status === "connecting";

  return (
    <Dialog open={showLacePrompt} onOpenChange={(open) => { if (!open) dismissLacePrompt(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
          </div>
          <DialogTitle className="text-center text-lg">
            Lace Wallet Not Detected
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            PrivateDrop requires the Lace wallet extension with Midnight
            Network support enabled.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          {/* Install Lace option */}
          <a
            href={LACE_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            Install Lace Wallet
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <p className="text-center text-xs text-gray-400">
            After installing, enable Midnight in Lace settings and refresh this
            page.
          </p>

          <Separator />

          {/* Demo mode option */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="mb-3 text-xs text-gray-500">
              Don&apos;t have Lace? Try the app with a simulated wallet to
              explore the privacy features.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={connectDemo}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Continue in Demo Mode
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
