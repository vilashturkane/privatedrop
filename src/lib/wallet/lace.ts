// ---------------------------------------------------------------------------
// Lace Wallet (Midnight Network) – detection, connection & simulation
// ---------------------------------------------------------------------------

/** Shape of the enabled Lace wallet API */
interface MnLaceWalletApi {
  balanceAndUtxos(): Promise<unknown>;
  state(): Promise<unknown>;
  address(): Promise<string>;
}

/** Shape of the injected Lace provider */
interface MnLaceProvider {
  enable(): Promise<MnLaceWalletApi>;
  isEnabled?(): Promise<boolean>;
  name?: string;
}

/** Augment the global `Window` so TS knows about wallet injection points */
declare global {
  interface Window {
    midnight?: {
      mnLace?: MnLaceProvider;
      [key: string]: unknown;
    };
    cardano?: {
      lace?: MnLaceProvider;
      [key: string]: unknown;
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
 * Immediately checks if any known Lace injection point exists.
 */
export function detectLaceWallet(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.midnight?.mnLace || window.cardano?.lace);
}

/**
 * Resolves the Lace provider from whichever injection point is available.
 */
function getProvider(): MnLaceProvider | null {
  if (typeof window === "undefined") return null;
  return (window.midnight?.mnLace as MnLaceProvider) ??
         (window.cardano?.lace as MnLaceProvider) ??
         null;
}

/**
 * Waits for the Lace wallet extension to inject into the page.
 * Extensions can take 100ms–2s to inject depending on browser load.
 *
 * Polls every 200ms for up to `timeoutMs` (default 3000ms).
 * Returns `true` if found, `false` if timed out.
 */
export function waitForLaceWallet(timeoutMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    // Already available
    if (detectLaceWallet()) {
      resolve(true);
      return;
    }

    const interval = 200;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;

      if (detectLaceWallet()) {
        clearInterval(timer);
        resolve(true);
        return;
      }

      if (elapsed >= timeoutMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, interval);
  });
}

// ── Real connection ─────────────────────────────────────────────────────────

/**
 * Enables the Lace wallet and returns a simplified wallet info object.
 * Throws if Lace is not installed or the user rejects the connection.
 */
export async function connectLaceWallet(): Promise<LaceWalletInfo> {
  const provider = getProvider();
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
