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

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, feature cards, privacy comparison |
| `/dashboard` | Wallet status, airdrop campaign info, eligibility CTA |
| `/verify` | ZK proof generation with before/after privacy states |
| `/history` | List of previous proof attempts (no private data stored) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript 5, React 19 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) (base-nova style) |
| Icons | [Lucide React](https://lucide.dev/) |
| Wallet | [Lace Wallet](https://www.lace.io/) for Midnight |
| Privacy | [Midnight Network](https://midnight.network/) ZK circuits |

---

## Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9
- **Lace Wallet** browser extension ([Install from Chrome Web Store](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk))
  - Enable the Midnight feature in Lace settings
  - Connect to **Midnight Preprod** network

> **Note:** The app includes a simulation mode that activates automatically when Lace is not installed, so you can demo the full flow without the extension.

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd privatedrop
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
privatedrop/
├── contracts/
│   └── eligibility/
│       ├── contract.compact      # Midnight Compact circuit
│       └── README.md             # Circuit documentation
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Navbar + Footer + WalletProvider)
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Tailwind v4 theme (purple accents)
│   │   ├── dashboard/page.tsx    # Dashboard
│   │   ├── verify/page.tsx       # Proof generation
│   │   └── history/page.tsx      # Proof history
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── layout/
│   │   │   ├── navbar.tsx        # Sticky navbar with nav links + wallet button
│   │   │   └── footer.tsx        # Minimal footer
│   │   ├── wallet/
│   │   │   └── connect-button.tsx  # Connect/disconnect wallet button
│   │   └── proof/                # (reserved for proof components)
│   ├── context/
│   │   └── wallet-context.tsx    # WalletProvider + useWallet hook
│   ├── lib/
│   │   ├── midnight/
│   │   │   ├── circuit.ts        # ZK proof generation (simulated)
│   │   │   └── proof-store.ts    # localStorage proof history
│   │   ├── wallet/
│   │   │   └── lace.ts           # Lace wallet detection & connection
│   │   └── utils.ts              # cn() utility
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── public/
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── next.config.ts
└── README.md
```

---

## Midnight Preprod Contract Setup

### Circuit Overview

The eligibility circuit (`contracts/eligibility/contract.compact`) takes:

| Input | Visibility | Description |
|---|---|---|
| `tokenBalance` | **Secret** | User's token balance (never revealed) |
| `requiredAmount` | Public | Minimum threshold for eligibility |
| `eligible` | Public (output) | `true` if balance ≥ threshold |

### Deployment Steps

> These steps require the Midnight CLI and SDK. See [Midnight Developer Docs](https://docs.midnight.network/) for installation.

**1. Compile the circuit**

```bash
compactc contracts/eligibility/contract.compact -o build/eligibility
```

**2. Deploy to Preprod**

```bash
midnight deploy build/eligibility \
  --network preprod \
  --wallet <your-midnight-wallet>
```

**3. Note the contract address**

After deployment, save the contract address. In production you would configure it as an environment variable:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
NEXT_PUBLIC_MIDNIGHT_NETWORK=preprod
```

**4. Integrate with the frontend**

Replace the simulated circuit call in `src/lib/midnight/circuit.ts` with the actual Midnight SDK `prove()` call using the deployed contract address.

---

## Demo Flow

1. **Landing** → Click "Connect Lace Wallet"
2. **Dashboard** → See wallet connected status + campaign info → Click "Check Eligibility"
3. **Verify** → Observe "Before Proof" (all data hidden) → Click "Generate Private Proof"
4. **Proof result** → ✓ Eligible appears, but wallet address and balance remain hidden
5. **History** → See the proof record with hash — no private data stored

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | No* | Deployed Midnight contract address |
| `NEXT_PUBLIC_MIDNIGHT_NETWORK` | No* | Network identifier (`preprod` or `mainnet`) |

*Not required for the demo — the app runs in simulation mode by default.

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Static Export

```bash
# Add to next.config.ts: output: 'export'
npm run build
# Deploy the `out/` directory to any static host
```

---

## License

MIT
