# PrivateDrop Eligibility Circuit

A [Midnight Network](https://midnight.network/) Compact smart contract that proves airdrop eligibility **without revealing the claimant's token balance**.

## What It Does

The circuit accepts a secret token balance and a public threshold, then outputs a single boolean — **eligible** or **not eligible** — as a zero-knowledge proof. The verifier (the network, other participants, anyone) can confirm the proof is valid but learns nothing about the actual balance.

```
┌─────────────────────────────────────────────┐
│            EligibilityCheck Circuit          │
│                                             │
│  SECRET   tokenBalance ──┐                  │
│                          ├─► eligible ───►  PUBLIC OUTPUT
│  PUBLIC   requiredAmount ┘    (Boolean)     │
│                                             │
│  Constraint:                                │
│    eligible = (tokenBalance >= requiredAmount)│
└─────────────────────────────────────────────┘
```

## Privacy Guarantee

| Input / Output   | Visibility | Description                                      |
| ---------------- | ---------- | ------------------------------------------------ |
| `tokenBalance`   | **Secret** | The prover's actual holdings — never leaves the local proving environment. |
| `requiredAmount` | Public     | The airdrop threshold — set by the campaign creator, visible to all. |
| `eligible`       | Public     | The result — a single bit: qualified or not.      |

The verifier learns **exactly one bit** of information (eligible / not eligible) and **nothing else** about the prover's balance. This is the fundamental privacy property of the circuit.

## Deploying to Midnight Preprod

> **Prerequisites:** Install the [Midnight SDK](https://docs.midnight.network/) and ensure `compactc` (the Compact compiler) is on your `PATH`.

### 1. Compile the circuit

```bash
compactc contracts/eligibility/contract.compact \
  --output contracts/eligibility/build/
```

This produces the proving key, verification key, and circuit artefacts needed for deployment.

### 2. Deploy via the Midnight SDK

Use the SDK's deployment utilities to submit the verification key to the Midnight Preprod testnet:

```bash
midnight deploy \
  --network preprod \
  --contract contracts/eligibility/build/EligibilityCheck \
  --wallet <YOUR_WALLET_ADDRESS>
```

The exact CLI flags may vary — consult the SDK docs for the current API.

### 3. Generate a proof (client-side)

On the claimant's machine:

```bash
midnight prove EligibilityCheck \
  --secret tokenBalance=15000 \
  --public requiredAmount=10000
```

The proof is submitted on-chain; the secret balance stays local.

### 4. Verify on-chain

Verification happens automatically when the proof is included in a Midnight transaction. Any node can check the proof against the deployed verification key without access to the secret inputs.

## Limitations

This is a **simplified demo circuit** intended to illustrate the privacy-preserving concept. A production-ready version would additionally include:

- **Merkle-proof membership** — proving the balance exists in a committed token-state tree rather than being self-asserted.
- **Nullifiers** — preventing the same proof from being replayed to claim multiple airdrops.
- **Time-bound validity** — binding the proof to a specific block range or epoch.
- **Multi-token support** — extending the circuit to check balances across different token types.

## Further Reading

- [Midnight Network Documentation](https://docs.midnight.network/)
- [Compact Language Reference](https://docs.midnight.network/develop/reference/compact)
- [Zero-Knowledge Proofs — Primer](https://midnight.network/technology)
