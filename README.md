# VesperSwap 🪐

VesperSwap adalah sebuah *Decentralized Application* (DApp) yang dibangun di atas ekosistem **Solana** menggunakan framework **Anchor** untuk *smart contract* (Rust) dan **React + Vite** untuk *frontend* (UI).

Repositori ini adalah sebuah paket komplit (*monorepo*) yang merangkap program-program di sisi blockchain dan antarmuka web penggunanya.

---

## 🏗️ Arsitektur Proyek

Proyek ini terbagi menjadi 2 bagian utama: **Backend (Smart Contracts)** dan **Frontend (Web App)**.

### 1. ⚙️ Smart Contracts (`/programs/`)
Terdapat 3 program (kontrak pintar) terpisah di dalam *workspace* Anchor ini, yang masing-masing melayani studi kasus berbeda pada blockchain Solana:

- **`vesperswap` (Program Counter)**
  - Program sederhana menggunakan konsep **PDA (Program Derived Address)**.
  - Memungkinkan *user* untuk menginisiasi (*initialize*) akun *counter* miliknya sendiri (terikat ke *wallet*), kemudian melakukan operasi tambah (`increment`) atau kurang (`decrement`) pada angka tersebut tanpa batas.
  - Program ini mencontohkan bagaimana menyimpan `state`/data mutlak di Solana.

- **`spl_token_minter` (Program SPL Token Minter)**
  - Mengurus pencetakan (*minting*) dan pembakaran (*burning*) token dasar menggunakan standar **SPL Token**.
  - Program ini berinteraksi langsung (Cross-Program Invocation/CPI) dengan *Token Program* bawaan Solana.

- **`nft_minter` (Program NFT Minter)**
  - Sebuah program pencetak NFT berbasis standar **Metaplex Master Edition V3**.
  - Mengizinkan user untuk mencetak sebuah NFT unik dengan mengisi paramater Nama, Simbol, dan URI gambar.
  - **Monetization:** Program ini memiliki mekanisme biaya (*fee*) internal, dimana setiap NFT yang dicetak akan secara paksa mentransfer **0.05 SOL** dari pengguna ke alamat kas (Treasury) yang sudah ditentukan (`HQ4yY...`).

### 2. 🖥️ Frontend Web (`/app/`)
Folder `app/` memuat *source code* website VesperSwap. Ini adalah titik interaksi pengguna terhadap ketiga program di atas.

- **Teknologi:** React, Vite, TypeScript.
- **Konektivitas Wallet:** Menggunakan `@solana/wallet-adapter-react` untuk memfasilitasi koneksi ke *wallet* seperti Phantom dan Solflare.
- **Komponen Utama (di `src/components/`):**
  - `<CounterCard />`: Tombol Antarmuka UI untuk berinteraksi dengan program `vesperswap`.
  - `<TokenCard />`: Tombol antarmuka mem-mint/membakar SPL Token dari `spl_token_minter`.
  - `<NftCard />`: Form pembuatan NFT yang terhubung langsung ke `nft_minter`.
- Berjalan otomatis di ekosistem **Devnet** (atau *Localnet/localhost* tergantung `VITE_RPC_URL`).

---

## 📂 Struktur Direktori Menyeluruh

```text
vesperswap/
├── Anchor.toml           # Konfigurasi workspace Anchor (IDs program, provider network)
├── Cargo.toml            # Konfigurasi package Rust untuk backend
├── programs/             # RUST SMART CONTRACTS
│   ├── nft_minter/       # Program pencetak NFT + Metaplex logic + treasury logic
│   ├── spl_token_minter/ # Program SPL token dasar
│   └── vesperswap/       # Program Counter stateful (PDA)
├── app/                  # UI FRONTEND (REACT + VITE)
│   ├── src/
│   │   ├── components/   # UI logic pemanggilan smart contract (Counter, Token, NFT)
│   │   ├── hooks/        # React Hooks untuk koneksi anchor provider
│   │   ├── idl/          # File IDL JSON (Jembatan komunikasi antara Frontend dan Backend)
│   │   └── App.tsx       # Root layout aplikasi (Dark mode, Wallet Providers)
│   ├── package.json
│   └── vite.config.ts
├── tests/                # Folder ts-mocha untuk menguji script rust saat perintah `anchor test`
├── package.json          # Root npm configurations (scripts & dependencies)
└── run.txt               # Step-by-step tutorial untuk menjalankan proyek di komputer lokal
```

---

## 🛠️ Hubungan Cara Kerja

1. Anda menulis kode kontrak pintar menggunakan Rust di `programs/`.
2. Anda melakukan kompilasi dengan `anchor build`.
3. Anchor secara otomatis akan membuat file IDL (berisi struktur fungsi Smart Contract dalam file `.json`) untuk frontend UI agar dapat memanggil instruksi RPC. File IDL di *deploy* bersamaan atau diimpor ke aplikasi React (`app/src/idl/`).
4. Pengguna mengeklik tombol pada Web React (`app/`), kemudian web akan membuat **Transaction** dan dikirim *Wallet* (Phantom), lalu transaksi diteruskan ke blockchain Solana menyentuh Smart Contract program secara langsung.
