# VesperSwap

![VesperSwap Preview](./image.png)

A full-stack **Solana Decentralized Application (DApp)** built with the **Anchor** framework for on-chain programs (Rust) and **React + Vite** for the frontend (TypeScript).

This monorepo bundles three independent smart contract programs and a unified, premium web interface to interact with all of them on the Solana **Devnet**.

---

## Architecture Overview

The project is split into two main layers: **Backend (Anchor Programs)** and **Frontend (React App)**.

### Backend — Smart Contracts (`/programs/`)

Three separate Anchor programs, each demonstrating a different pattern on Solana:

| Program | Description |
|---|---|
| `vesperswap` | Automated Market Maker (AMM) pool allowing token swaps between SOL and VESP |
| `spl_token_minter` | Mint and burn **SPL Tokens** via Cross-Program Invocation (CPI) with the Token Program |
| `nft_minter` | Mint **Metaplex Master Edition NFTs** with on-chain metadata; includes a 0.05 SOL treasury fee per mint |

### Frontend — Web App (`/app/`)

A React + Vite + TypeScript application that connects to the deployed programs via Anchor's IDL. It features a premium design with fluid WebGL backgrounds and glassmorphism UI elements.

- **Wallet Support:** Phantom & Solflare via `@solana/wallet-adapter-react`
- **Network:** Solana Devnet (configurable via `.env` or defaults)
- **Components:**
  - `<SwapCard />` — Interacts with the `vesperswap` AMM program
  - `<TokenCard />` — Mints and burns SPL Tokens via `spl_token_minter`
  - `<NftCard />` — Creates NFTs via `nft_minter`
  - `<FluidBackground />` / `<WaterBackground />` — Dynamic visual elements for a rich user experience
  - `<Navbar />` & `<Footer />` — Navigation and layout elements

---

## Directory Structure

```text
vesperswap/
│
├── .vscode/                                # Workspace settings
│
├── app/                                    # Frontend (React + Vite + TS)
│   ├── src/
│   │   ├── components/                     # Reusable UI components
│   │   │   ├── AppContext.tsx
│   │   │   ├── CounterCard.tsx
│   │   │   ├── FluidBackground.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── NftCard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── SwapCard.tsx
│   │   │   ├── ToastContext.tsx
│   │   │   ├── TokenCard.tsx
│   │   │   ├── WalletButton.tsx
│   │   │   └── WaterBackground.tsx
│   │   ├── hooks/                          # React hooks
│   │   │   ├── useCounter.ts
│   │   │   ├── useNft.ts
│   │   │   ├── useSwap.ts
│   │   │   ├── useTheme.tsx
│   │   │   └── useToken.ts
│   │   ├── idl/                            # Generated IDL JSON files
│   │   ├── pages/                          # Page views
│   │   │   ├── NftStudioPage.tsx
│   │   │   ├── SwapPage.tsx
│   │   │   └── TokenFactoryPage.tsx
│   │   ├── App.tsx                         # Root layout
│   │   ├── index.css                       # Global styles
│   │   └── main.tsx                        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── migrations/                             # Anchor deployment scripts
│   └── deploy.ts
│
├── programs/                               # Rust smart contracts (Anchor)
│   ├── nft_minter/                         # NFTs with treasury fee
│   │   ├── Cargo.toml
│   │   └── src/lib.rs
│   ├── spl_token_minter/                   # SPL token mint/burn logic
│   │   ├── Cargo.toml
│   │   └── src/lib.rs
│   └── vesperswap/                         # AMM token swap logic
│       ├── Cargo.toml
│       └── src/lib.rs
│
├── tests/                                  # Integration tests (ts-mocha)
│   ├── nft_minter.ts
│   ├── spl_token_minter.ts
│   └── vesperswap.ts
│
├── .gitignore
├── Anchor.toml                             # Anchor workspace config
├── Cargo.lock
├── Cargo.toml
├── package.json
├── package-lock.json
├── run.txt                                 # Step-by-step setup guide
├── rust-toolchain.toml                     # Rust version specification
├── tsconfig.json
└── yarn.lock
```

---

## How It Works

```
1. Write smart contract logic in Rust  →  programs/<name>/src/lib.rs
           ↓
2. Compile with `anchor build`
           ↓
3. Anchor generates IDL (.json) + TypeScript types  →  target/idl/ & target/types/
           ↓
4. Frontend imports IDL  →  Creates typed Program instance via Anchor client
           ↓
5. User interacts with UI  →  Transaction built & signed by wallet (Phantom/Solflare)
           ↓
6. Transaction sent to Solana Devnet  →  Smart contract executes on-chain
```

---

## Quick Start

See [`run.txt`](./run.txt) for the full step-by-step setup guide.

```bash
# Clone and install
git clone https://github.com/alfebrio/vesperswap.git
cd vesperswap
yarn install

# Build & deploy to Devnet
anchor build
anchor deploy

# Run frontend
cd app && npm install && npm run dev
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Rust, Anchor Framework |
| Blockchain | Solana (Devnet) |
| Frontend | React 18, Vite, TypeScript |
| UI/UX | Framer Motion, Vanilla CSS (Glassmorphism) |
| Wallet | Solana Wallet Adapter (Phantom, Solflare) |
| NFT Standard | Metaplex Token Metadata (Master Edition V3) |
| Token Standard | SPL Token Program |
| Testing | ts-mocha, Chai |
