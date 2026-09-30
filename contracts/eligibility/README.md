# EligibilityCheck Circuit

A [Midnight Network](https://midnight.network/) Compact smart contract that proves airdrop eligibility **without revealing the claimant's token balance**.

## Deployed Contract

| Field | Value |
|---|---|
| **Contract Address** | `0x00a6b3f14d8e2c7190f5e834b7c2d6a1e09f38d4b5c7e2a1d6f3b8c4e9a0d5f2` |
| **Network** | Midnight Preprod |
| **Circuit** | `EligibilityCheck` |
| **Source** | [`contract.compact`](contract.compact) |

---

## Privacy Model

The circuit enforces a cryptographic privacy guarantee at the proving level — not by application logic.

### Data Flow

```
  SECRET (never leaves browser)        PUBLIC (on-chain / verifiable)
  ──────────────────────────────        ─────────────────────────────
  tokenBalance: 2500 tMIDN    ──►      eligible: true
                                        proofHash: 0x7a3f...
                                        verificationKey: 0x9b1c...
```

### Input / Output Visibility

| Input / Output | Visibility | Type | Description |
|---|---|---|---|
| `tokenBalance` | **Secret** | `Field` | User's actual holdings — consumed inside circuit, never in proof output |
| `requiredAmount` | Public | `Field` | Airdrop threshold set by campaign creator |
| `eligible` | Public (output) | `Boolean` | `true` if `tokenBalance >= requiredAmount` |

### What the verifier learns

- ✅ Whether the prover is eligible (1 bit)
- ✅ That the proof was generated correctly (math checks out)
- ❌ Nothing about the actual token balance
- ❌ Nothing about the wallet address
- ❌ Nothing about transaction history

The proof system guarantees that `secret` inputs **cannot be extracted** from the proof — this is a mathematical property of zero-knowledge proofs, not a policy decision.

---

## Circuit Source

```compact
circuit EligibilityCheck {
  secret tokenBalance: Field;
  public requiredAmount: Field;
  public eligible: Boolean;

  eligible <== greaterThanOrEqual(tokenBalance, requiredAmount);
}
```

Full annotated source: [`contract.compact`](contract.compact)

---

## Verify the Deployment

The contract source is fully open. Anyone can verify the deployed circuit matches:

```bash
# 1. Compile from source
compactc contract.compact -o build/EligibilityCheck

# 2. Verify against deployed contract
midnight verify-contract \
  --address 0x00a6b3f14d8e2c7190f5e834b7c2d6a1e09f38d4b5c7e2a1d6f3b8c4e9a0d5f2 \
  --network preprod \
  --local-build build/EligibilityCheck

# Expected output:
# ✓ Verification key matches deployed contract
# ✓ Circuit hash: 0x4e8f...
```

---

## Deploy Your Own

```bash
# Compile
compactc contract.compact -o build/EligibilityCheck

# Deploy
midnight deploy build/EligibilityCheck \
  --network preprod \
  --wallet <your-midnight-wallet>

# Output:
# ✓ Contract deployed at: 0x<new-address>
# ✓ Verification key published
```

---

## Limitations

This is a **demo circuit**. A production version would add:

- **Merkle-proof membership** — proving balance exists in a committed state tree
- **Nullifiers** — preventing proof replay across multiple claims
- **Time-bound validity** — binding proofs to a block range or epoch
- **Multi-token support** — checking balances across token types

---

## References

- [Midnight Network Docs](https://docs.midnight.network/)
- [Compact Language Reference](https://docs.midnight.network/develop/reference/compact)
- [Zero-Knowledge Proofs — Midnight](https://midnight.network/technology)
