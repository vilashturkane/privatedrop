# 🛡️ PrivateDrop

**Privacy-preserving Web3 airdrop eligibility checker** built on [Midnight Network](https://midnight.network/).

Prove you qualify for an airdrop **without revealing** your wallet address, token balance, or transaction history — powered by zero-knowledge proofs.

[![Built by Vilash](https://img.shields.io/badge/Built%20by-Vilash-7c3aed?style=flat-square)](https://x.com/web3vilash)
[![X (Twitter)](https://img.shields.io/badge/@web3vilash-000?style=flat-square&logo=x&logoColor=white)](https://x.com/web3vilash)
[![GitHub](https://img.shields.io/badge/GitHub-vilashturkane-181717?style=flat-square&logo=github)](https://github.com/vilashturkane)
[![Network](https://img.shields.io/badge/Midnight-Preprod-7c3aed?style=flat-square)](https://midnight.network/)

---

## Privacy Claim

PrivateDrop makes a single, auditable privacy guarantee:

> **A user can prove they hold enough tokens to qualify for an airdrop without revealing their wallet address, token balance, or transaction history.**

### What is revealed

| Data | Revealed to verifier? |
|---|---|
| Eligibility result (yes / no) | ✅ Yes |
| Zero-knowledge proof artifact | ✅ Yes |
| Verification key | ✅ Yes |

### What is NEVER revealed

| Data | Revealed to verifier? |
|---|---|
| Wallet address | ❌ Never |
| Token balance | ❌ Never |
| Transaction history | ❌ Never |
| Which tokens are held | ❌ Never |
| Any other account data | ❌ Never |

### How this is enforced

The privacy guarantee is enforced at the **circuit level**, not by application logic:

1. The user's `tokenBalance` is declared as a `secret` witness in the Compact circuit
2. The ZK proving system mathematically guarantees that `secret` inputs cannot be extracted from the proof
3. The proof output contains only `eligible: Boolean` — a single bit
4. The verifier confirms the proof is valid using the on-chain verification key
5. At no point does the secret balance leave the user's browser

This is not "trust us" privacy — it is **cryptographic privacy** enforced by the Midnight Network's zero-knowledge proof system.

```
  User's Machine (private)              Network (public)
  ─────────────────────────             ──────────────────
  tokenBalance: 2500 tMIDN   ──►  ZK Circuit  ──►  eligible: true
                                                    proofHash: 0x7a3f...
                                                    verificationKey: 0x9b1c...

  ✗ tokenBalance is CONSUMED        ✓ Only the boolean
    inside the circuit and             and proof artifacts
    never included in output           are transmitted
```

---

## Preprod Contract

The `EligibilityCheck` circuit is deployed on **Midnight Preprod** testnet.

| Field | Value |
|---|---|
| **Contract Address** | `0x00a6b3f14d8e2c7190f5e834b7c2d6a1e09f38d4b5c7e2a1d6f3b8c4e9a0d5f2` |
| **Network** | Midnight Preprod |
| **Circuit** | `EligibilityCheck` |
| **Compiler** | `compactc` (Midnight Compact) |
| **Source** | [`contracts/eligibility/contract.compact`](contracts/eligibility/contract.compact) |

### Circuit Inputs / Outputs

```
┌─────────────────────────────────────────────────┐
│             EligibilityCheck Circuit            │
│                                                 │
│  SECRET   tokenBalance ────┐                    │
│                            ├──► eligible ──► PUBLIC OUTPUT
│  PUBLIC   requiredAmount ──┘    (Boolean)       │
│                                                 │
│  Constraint:                                    │
│    eligible = (tokenBalance >= requiredAmount)   │
└─────────────────────────────────────────────────┘
```

| Input / Output | Visibility | Type | Description |
|---|---|---|---|
| `tokenBalance` | **Secret** | `Field` | User's token holdings — never leaves the prover |
| `requiredAmount` | Public | `Field` | Campaign threshold (e.g. 1,000 tMIDN) |
| `eligible` | Public (output) | `Boolean` | `true` if `tokenBalance >= requiredAmount` |

### Verify the contract

The contract source is fully open. To verify the deployed circuit matches the source:

```bash
# 1. Compile from source
compactc contracts/eligibility/contract.compact -o build/eligibility

# 2. Compare the verification key hash with the deployed contract
midnight verify-contract \
  --address 0x00a6b3f14d8e2c7190f5e834b7c2d6a1e09f38d4b5c7e2a1d6f3b8c4e9a0d5f2 \
  --network preprod \
  --local-build build/eligibility
```

### Deploy your own instance

```bash
# Compile
compactc contracts/eligibility/contract.compact -o build/eligibility

# Deploy to Preprod
midnight deploy build/eligibility \
  --network preprod \
  --wallet <your-midnight-wallet>

# Set the contract address in your environment
export NEXT_PUBLIC_CONTRACT_ADDRESS=<your-deployed-address>
export NEXT_PUBLIC_MIDNIGHT_NETWORK=preprod
```

---

## Why PrivateDrop?

Traditional airdrops force users to expose their wallet data to prove eligibility. PrivateDrop flips this model:

| | Traditional Airdrop | PrivateDrop |
|---|---|---|
| Wallet Address | ✕ Exposed publicly | ✓ Never revealed |
| Token Balance | ✕ Visible on-chain | ✓ Secret witness only |
| Transaction History | ✕ Fully traceable | ✓ No on-chain footprint |
| Eligibility Result | ✓ Verified | ✓ Verified via ZK proof |
| Privacy Model | Trust-based | Cryptographic (ZK) |

---

## Features

- 🔐 **Zero-Knowledge Proofs** — Eligibility verified without leaking private data
- 👛 **Lace Wallet** — Auto-detect, connect, disconnect with install prompt
- 🌗 **Dark & Light Mode** — Toggle themes, respects system preference
- 📜 **Proof History** — Browse previous verifications (no private data stored)
- 🎭 **Demo Mode** — Full flow without Lace installed
- ⚡ **Midnight Preprod** — Deployed and verifiable on testnet

---

## Getting Started

```bash
git clone https://github.com/vilashturkane/privatedrop.git
cd privatedrop
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Flow

1. **Landing** → Click "Connect Lace Wallet"
2. **Dashboard** → Wallet status + campaign info → "Check Eligibility"
3. **Verify** → "Before Proof" shows all data hidden → "Generate Private Proof"
4. **Proof Result** → ✓ Eligible — balance and address remain hidden
5. **History** → Proof records with hash — no private data stored

---

## Project Structure

```
privatedrop/
├── contracts/
│   └── eligibility/
│       ├── contract.compact       # Midnight Compact ZK circuit (source of truth)
│       └── README.md              # Circuit docs + deployment steps
├── src/
│   ├── app/                       # Pages — landing, dashboard, verify, history
│   ├── components/                # UI, layout, wallet, proof components
│   ├── context/                   # WalletProvider + useWallet hook
│   ├── lib/midnight/              # ZK circuit integration + proof store
│   ├── lib/wallet/                # Lace wallet detection & connection
│   └── types/                     # TypeScript interfaces
└── README.md
```

---

## Connect

Built by **[Vilash](https://x.com/web3vilash)**

- 𝕏 [@web3vilash](https://x.com/web3vilash)
- GitHub [@vilashturkane](https://github.com/vilashturkane)

---

## License

MIT
