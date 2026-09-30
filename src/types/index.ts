/** Wallet connection states */
export type WalletStatus = "disconnected" | "connecting" | "connected" | "error";

/** Wallet context state */
export interface WalletState {
  status: WalletStatus;
  address: string | null;
  /** Truncated display address, e.g. "mid1…a3f9" */
  displayAddress: string | null;
}

/** A single proof attempt record */
export interface ProofRecord {
  id: string;
  timestamp: number;
  campaign: string;
  eligible: boolean;
  /** Proof hash / identifier returned from the circuit */
  proofHash: string;
}

/** Airdrop campaign definition */
export interface Campaign {
  id: string;
  name: string;
  description: string;
  requiredAmount: number;
  tokenSymbol: string;
  status: "active" | "ended" | "upcoming";
}
