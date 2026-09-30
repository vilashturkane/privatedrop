"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import { WalletDialog } from "@/components/wallet/wallet-dialog";

export function ConnectButton() {
  const { status, displayAddress, connect, disconnect } = useWallet();

  return (
    <>
      {/* The Lace install / demo mode dialog */}
      <WalletDialog />

      {status === "connecting" && (
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="animate-spin" />
          Connecting…
        </Button>
      )}

      {status === "connected" && (
        <Button variant="outline" size="sm" onClick={disconnect}>
          <span className="size-2 rounded-full bg-green-500" />
          {displayAddress}
        </Button>
      )}

      {status === "error" && (
        <Button
          size="sm"
          className={cn("bg-red-600 text-white hover:bg-red-700")}
          onClick={connect}
        >
          Retry
        </Button>
      )}

      {status === "disconnected" && (
        <Button
          size="sm"
          className={cn("bg-purple-600 text-white hover:bg-purple-700")}
          onClick={connect}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}
