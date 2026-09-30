# 🛡️ PrivateDrop

**Privacy-preserving Web3 airdrop eligibility checker** built on [Midnight Network](https://midnight.network/).

Prove you qualify for an airdrop **without revealing** your wallet address, token balance, or transaction history — powered by zero-knowledge proofs.

[![Built by Vilash](https://img.shields.io/badge/Built%20by-Vilash-7c3aed?style=flat-square)](https://x.com/web3vilash)
[![X (Twitter)](https://img.shields.io/badge/@web3vilash-000?style=flat-square&logo=x&logoColor=white)](https://x.com/web3vilash)
[![GitHub](https://img.shields.io/badge/GitHub-vilashturkane-181717?style=flat-square&logo=github)](https://github.com/vilashturkane)

---

## Why PrivateDrop?

Traditional airdrops force users to expose their wallet data to prove eligibility. PrivateDrop flips this model using zero-knowledge proofs:

| | Traditional Airdrop | PrivateDrop |
|---|---|---|
| Wallet Address | ✕ Exposed | ✓ Hidden |
| Token Balance | ✕ Visible | ✓ Hidden |
| Transaction History | ✕ Public | ✓ Hidden |
| Eligibility Result | ✓ Verified | ✓ Verified |

> **One bit of information** — "eligible or not" — is all that gets shared. Everything else stays private.

---

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                       │
│                                                         │
│   ┌──────────────┐    ┌──────────────────────────────┐  │
│   │ Lace Wallet  │───▶│  ZK Circuit (local proving)  │  │
│   │              │    │                              │  │
│   │ tokenBalance │    │  secret: tokenBalance        │  │
│   │ (private)    │    │  public: requiredAmount       │  │
│   └──────────────┘    │  output: eligible (bool)     │  │
│                       └──────────────┬───────────────┘  │
│                                      │                  │
│                         ┌────────────▼────────────┐     │
│                         │     Proof Result        │     │
│                         │  ✓ eligible: true       │     │
│                         │  ✗ balance: HIDDEN      │     │
│                         │  ✗ address: HIDDEN      │     │
│                         └─────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## Features

- 🔐 **Zero-Knowledge Proofs** — Verify eligibility without leaking private data
- 👛 **Lace Wallet Integration** — Connect, disconnect, auto-detect with install prompt
- 🌗 **Dark & Light Mode** — Toggle between themes, respects system preference
- 📜 **Proof History** — Browse previous verification attempts (no private data stored)
- 🎭 **Demo Mode** — Explore the full flow without Lace wallet installed
- ⚡ **Midnight Network** — Built on privacy-first blockchain infrastructure

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
2. **Dashboard** → See wallet status + campaign info → Click "Check Eligibility"
3. **Verify** → Observe "Before Proof" (all data hidden) → Click "Generate Private Proof"
4. **Proof Result** → ✓ Eligible — wallet address and balance remain hidden
5. **History** → Browse proof records — no private data stored

---

## Project Structure

```
privatedrop/
├── contracts/eligibility/     # Midnight Compact ZK circuit
├── src/
│   ├── app/                   # Pages — landing, dashboard, verify, history
│   ├── components/            # UI, layout, wallet, proof components
│   ├── context/               # WalletProvider + useWallet hook
│   ├── lib/midnight/          # ZK circuit integration + proof store
│   ├── lib/wallet/            # Lace wallet detection & connection
│   └── types/                 # TypeScript interfaces
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
