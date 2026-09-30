"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { WalletStatus } from "@/types";
import {
  connectLaceWallet,
  connectSimulated,
  waitForLaceWallet,
  disconnectLaceWallet,
  markLaceConnected,
} from "@/lib/wallet/lace";

// ── Context value shape ─────────────────────────────────────────────────────

interface WalletContextValue {
  status: WalletStatus;
  address: string | null;
  displayAddress: string | null;
  isSimulated: boolean;
  error: string | null;
  showLacePrompt: boolean;
  connect: () => Promise<void>;
  connectDemo: () => Promise<void>;
  disconnect: () => void;
  dismissLacePrompt: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

// ── Helpers ─────────────────────────────────────────────────────────────────

function truncateAddress(address: string): string {
  if (address.length <= 13) return address;
  return `${address.slice(0, 8)}…${address.slice(-4)}`;
}

// ── Provider ────────────────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<WalletStatus>("disconnected");
  const [address, setAddress] = useState<string | null>(null);
  const [displayAddress, setDisplayAddress] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLacePrompt, setShowLacePrompt] = useState(false);

  const finishConnection = useCallback(
    (walletAddress: string, simulated: boolean) => {
      markLaceConnected();
      setAddress(walletAddress);
      setDisplayAddress(truncateAddress(walletAddress));
      setIsSimulated(simulated);
      setStatus("connected");
      setShowLacePrompt(false);
    },
    []
  );

  // Try to connect to real Lace wallet
  const connect = useCallback(async () => {
    setError(null);
    setStatus("connecting");

    // Wait up to 3 seconds for Lace to inject into the page
    const found = await waitForLaceWallet(3000);

    if (!found) {
      // Lace not found after waiting — show install / demo dialog
      setStatus("disconnected");
      setShowLacePrompt(true);
      return;
    }

    // Lace found — connect for real
    try {
      const info = await connectLaceWallet();
      finishConnection(info.address, false);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Failed to connect Lace wallet"
      );
    }
  }, [finishConnection]);

  // Explicitly enter demo / simulation mode
  const connectDemo = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    setShowLacePrompt(false);

    try {
      const info = await connectSimulated();
      finishConnection(info.address, true);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Failed to start demo mode"
      );
    }
  }, [finishConnection]);

  const disconnect = useCallback(() => {
    disconnectLaceWallet();
    setStatus("disconnected");
    setAddress(null);
    setDisplayAddress(null);
    setIsSimulated(false);
    setError(null);
    setShowLacePrompt(false);
  }, []);

  const dismissLacePrompt = useCallback(() => {
    setShowLacePrompt(false);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        status,
        address,
        displayAddress,
        isSimulated,
        error,
        showLacePrompt,
        connect,
        connectDemo,
        disconnect,
        dismissLacePrompt,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a <WalletProvider>");
  }
  return ctx;
}
