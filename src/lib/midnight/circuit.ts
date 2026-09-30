/**
 * Midnight Network ZK Circuit — Airdrop Eligibility Verification
 *
 * In production this module would import the Midnight SDK and call the
 * actual `prove()` function exposed by a deployed Midnight smart contract.
 * The contract's Compact program would accept the private token balance as
 * a secret witness, compare it against the public threshold, and emit a
 * zero-knowledge proof that the prover meets the requirement — without
 * ever revealing the balance itself.
 *
 * For this demo we simulate that flow: the private balance is used only
 * inside this function and is **never** included in the returned result.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Inputs fed into the ZK circuit. */
export interface ProofInput {
  /** The secret input — the user's actual token balance (never exposed). */
  privateTokenBalance: number;
  /** The public threshold required to qualify for the airdrop. */
  requiredAmount: number;
}

/** The result emitted by the circuit after proof generation. */
export interface ProofResult {
  /** Whether the prover satisfies the eligibility predicate. */
  eligible: boolean;
  /** A hex-encoded identifier for the generated proof (64 hex chars). */
  proofHash: string;
  /** Unix-ms timestamp of when the proof was created. */
  timestamp: number;
  /** A short hex-encoded verification key (40 hex chars). */
  verificationKey: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a string of random hexadecimal characters.
 *
 * @param length - The number of hex characters to produce.
 * @returns A lowercase hex string of the requested length.
 */
export function generateRandomHex(length: number): string {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// ---------------------------------------------------------------------------
// Circuit execution (simulated)
// ---------------------------------------------------------------------------

/**
 * Simulate a Midnight ZK circuit that proves airdrop eligibility.
 *
 * In a real integration this would:
 *   1. Serialize `input` into the format expected by the Compact program.
 *   2. Call `midnight.prove(contractAddress, "checkEligibility", input)`.
 *   3. Return the on-chain proof artefact and its verification key.
 *
 * The private token balance is consumed inside the circuit and is **never**
 * included in the returned {@link ProofResult}.
 *
 * @param input - The public and private inputs for the eligibility circuit.
 * @returns A promise that resolves with the proof result after a simulated
 *          proving delay of 2–3 seconds.
 */
export async function generateEligibilityProof(
  input: ProofInput,
): Promise<ProofResult> {
  // Simulate realistic proving time (2 000 – 3 000 ms).
  const delayMs = 2000 + Math.random() * 1000;
  await new Promise<void>((resolve) => setTimeout(resolve, delayMs));

  // --- Circuit logic (would execute inside the ZK VM) ---
  const eligible = input.privateTokenBalance >= input.requiredAmount;

  // Generate artefacts that mimic what a real prover would emit.
  const proofHash = "0x" + generateRandomHex(64);
  const verificationKey = "0x" + generateRandomHex(40);

  // NOTE: `privateTokenBalance` is intentionally excluded from the result.
  // This is the core privacy guarantee of the Midnight protocol.
  return {
    eligible,
    proofHash,
    timestamp: Date.now(),
    verificationKey,
  };
}
