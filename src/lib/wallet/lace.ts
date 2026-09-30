// ---------------------------------------------------------------------------
// Lace Wallet (Midnight Network) – detection, connection & simulation
// ---------------------------------------------------------------------------

/** Shape of the enabled Lace wallet API */
interface MnLaceWalletApi {
  balanceAndUtxos(): Promise<unknown>;
  state(): Promise<unknown>;
  address(): Promise<string>;
}

/** Shape of the injected Lace provider at `window.midnight.mnLace` */
interface MnLaceProvider {
  enable(): Promise<MnLaceWalletApi>;
}

/** Augment the global `Window` so TS knows about `window.midnight` */
declare global {
  interface Window {
    midnight?: {
      mnLace?: MnLaceProvider;
    };
  }
}

// ── Public constants ────────────────────────────────────────────────────────

export const LACE_INSTALL_URL =
  "https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk";

// ── Wallet info returned by connection helpers ──────────────────────────────

export interface LaceWalletInfo {
  address: string;
}

// ── Detection ───────────────────────────────────────────────────────────────

/**
 * Returns `true` when the Lace wallet for Midnight is detected on the page
 * (i.e. the extension has injected `window.midnight.mnLace`).
 */
export function detectLaceWallet(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.midnight?.mnLace;
}

// ── Real connection ─────────────────────────────────────────────────────────

/**
 * Enables the Lace wallet and returns a simplified wallet info object.
 * Throws if Lace is not installed or the user rejects the connection.
 */
export async function connectLaceWallet(): Promise<LaceWalletInfo> {
  const provider = window.midnight?.mnLace;
  if (!provider) {
    throw new Error(
      "Lace wallet for Midnight is not installed. Please install the extension."
    );
  }

  const api = await provider.enable();
  const address = await api.address();

  return { address };
}

// ── Disconnect (clears local state only – Lace has no disconnect RPC) ───────

let _connected = false;

export function disconnectLaceWallet(): void {
  _connected = false;
}

export function isLaceConnected(): boolean {
  return _connected;
}

/** Called internally after a successful connection to track state. */
export function markLaceConnected(): void {
  _connected = true;
}

// ── Simulation mode ─────────────────────────────────────────────────────────

const SIMULATED_ADDRESS =
  "mid1qx7e4f2bc9d81a56e7340fcb2d9e81763a5c04d87f12e6b39a0c5d8e72a3f9";

/**
 * Simulates a wallet connection when the Lace extension is not available.
 * Introduces a realistic 1.5 s delay before resolving.
 */
export async function connectSimulated(): Promise<LaceWalletInfo> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { address: SIMULATED_ADDRESS };
}
