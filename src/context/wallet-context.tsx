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
  detectLaceWallet,
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
  connect: () => Promise<void>;
  disconnect: () => void;
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

  const connect = useCallback(async () => {
    setStatus("connecting");
    setError(null);

    try {
      let walletAddress: string;

      if (detectLaceWallet()) {
        const info = await connectLaceWallet();
        walletAddress = info.address;
        setIsSimulated(false);
      } else {
        const info = await connectSimulated();
        walletAddress = info.address;
        setIsSimulated(true);
      }

      markLaceConnected();
      setAddress(walletAddress);
      setDisplayAddress(truncateAddress(walletAddress));
      setStatus("connected");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Failed to connect wallet"
      );
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectLaceWallet();
    setStatus("disconnected");
    setAddress(null);
    setDisplayAddress(null);
    setIsSimulated(false);
    setError(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        status,
        address,
        displayAddress,
        isSimulated,
        error,
        connect,
        disconnect,
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
