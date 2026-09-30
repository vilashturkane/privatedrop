# PrivateDrop

**Privacy-preserving Web3 airdrop eligibility checker** built on [Midnight Network](https://midnight.network/).

Users can prove they are eligible for an airdrop **without revealing** their wallet address, token balance, or transaction history — powered by zero-knowledge proofs.

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

The private token balance **never leaves the browser**. Only the boolean result and a cryptographic proof are emitted.

---

## Getting Started

```bash
git clone https://github.com/vilashturkane/privatedrop.git
cd privatedrop
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Flow

1. **Landing** → Click "Connect Lace Wallet"
2. **Dashboard** → See wallet connected status + campaign info → Click "Check Eligibility"
3. **Verify** → Observe "Before Proof" (all data hidden) → Click "Generate Private Proof"
4. **Proof result** → ✓ Eligible appears, but wallet address and balance remain hidden
5. **History** → See the proof record with hash — no private data stored

> **Note:** The app includes a demo mode when Lace wallet is not installed, so you can explore the full flow without the extension.

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

## License

MIT
