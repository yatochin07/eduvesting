# EduVesting — Manajemen Investasi & Keuangan Mahasiswa (v3)

Arsitektur baru dari proyek [MANAJEMEN-INVESTASI-MAHASISWA-V2](https://github.com/yatochin07/MANAJEMEN-INVESTASI-MAHASISWA-V2) (awalnya vanilla HTML/JS), dibangun ulang total dengan tech stack production-grade: **Next.js + TypeScript** (frontend), **FastAPI Python** (backend), **Supabase PostgreSQL** (database + RLS), **Docker**, dan **CI/CD** otomatis.

> Baca `ROADMAP.md` untuk panduan step-by-step dari nol hingga live di production.

---

## 1. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python 3.12) + SQLAlchemy 2.0 + Alembic |
| Database | Supabase PostgreSQL (dengan Row Level Security / RLS) |
| Auth | Google OAuth 2.0 + JWT (access & refresh token) |
| Hosting Frontend | Vercel |
| Hosting Backend | Render (Docker) |
| Data Saham US | Finnhub API |
| Data Saham IDX & Reksadana | yfinance (Yahoo Finance) |
| Data Kripto & Emas | CoinGecko API |
| Widget Analisis Pasar | TradingView Widget |
| AI Insight | Groq API (LLM) |
| CI/CD | GitHub Actions |

---

## 2. Struktur Folder

```
eduvesting-v3/
├── backend/                   # FastAPI — layered architecture
│   ├── app/
│   │   ├── main.py            # entrypoint FastAPI
│   │   ├── core/               # config, security (JWT), middleware
│   │   ├── db/                 # session, base model
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── api/v1/endpoints/    # routers (1 file = 1 modul halaman)
│   │   ├── services/            # business logic + integrasi API eksternal
│   │   │   ├── market_data/     # finnhub, yfinance, coingecko, router facade
│   │   │   └── ai/               # groq client
│   │   └── repositories/        # akses database (query layer)
│   ├── alembic/                 # migration files
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml
│   └── .env.example
│
├── frontend/                   # Next.js + TypeScript
│   ├── src/
│   │   ├── app/                 # routing (App Router) — 1 folder = 1 halaman
│   │   ├── components/
│   │   │   ├── ui/               # Button, Card, Input, Modal, dst (reusable)
│   │   │   ├── layout/           # Navbar, Sidebar, Footer, DashboardLayout
│   │   │   ├── widgets/          # TradingViewWidget
│   │   │   └── auth/             # GoogleLoginButton
│   │   ├── lib/                  # api-client (axios), auth.ts, utils.ts
│   │   ├── hooks/                # useAuth, dst
│   │   ├── types/                # tipe TypeScript bersama
│   │   └── middleware.ts         # proteksi route privat
│   ├── package.json
│   └── vercel.json
│
├── docker-compose.yml           # development lokal
├── .github/workflows/           # CI/CD (backend-ci.yml, frontend-ci.yml)
├── README.md
└── ROADMAP.md
```

**Layered Architecture Backend** (arah ketergantungan satu arah, jangan dilanggar):

```
Router (API endpoint) → Service (business logic) → Repository (query DB) → Model (SQLAlchemy)
                       ↘ Service eksternal (market_data / ai) untuk data realtime
```

---

## 3. Pemetaan Halaman & Fitur

| # | Halaman | API Realtime | Simpan ke DB | RLS |
|---|---|---|---|---|
| 1 | Landing + Login/Register | Google OAuth | Ya (users, sessions) | Enable |
| 2 | Dashboard | Agregasi dari modul lain | Ya | Enable |
| 3 | Portfolio | Finnhub / yfinance / CoinGecko | Ya | Enable |
| 4 | Transaction | Tidak | Ya | Enable |
| 5 | Goals | Tidak | Ya | Disable |
| 6 | Allocation | Tidak | Ya | Enable |
| 7 | Insight (AI) | Groq AI | Ya | Enable |
| 8 | Edukasi | Tidak | Ya | Disable |
| 9 | Market | TradingView Widget | Ya (watchlist) | Disable |
| 10 | Calculator | Tidak | Ya | Disable |
| 11 | Settings | Tidak | Ya | Enable |

Sumber data realtime per jenis aset di Portfolio:
- **Saham US** → Finnhub (`asset_type: us_stock`)
- **Saham IDX & Reksadana** → yfinance (`asset_type: idx_stock`, `mutual_fund`)
- **Kripto & Emas** → CoinGecko (`asset_type: crypto`, `gold`)

Logika pemilihan provider ada di satu tempat: `backend/app/services/market_data/router.py`.

---

## 4. Setup Development Lokal

### 4.1 Backend (FastAPI)

```bash
cd backend

# 1. Buat virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements-dev.txt

# 3. Siapkan environment variable
cp .env.example .env
# isi .env: SECRET_KEY, DATABASE_URL (Supabase), GOOGLE_CLIENT_ID/SECRET,
# FINNHUB_API_KEY, GROQ_API_KEY, dll — lihat ROADMAP.md bagian 3.

# 4. Jalankan migration database
alembic upgrade head

# 5. Jalankan server development
uvicorn app.main:app --reload
# Backend jalan di http://localhost:8000, dokumentasi Swagger di /docs
```

### 4.2 Frontend (Next.js)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Siapkan environment variable
cp .env.local.example .env.local
# isi NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID, dst.

# 3. Jalankan development server
npm run dev
# Frontend jalan di http://localhost:3000
```

### 4.3 Menjalankan Keduanya via Docker Compose

```bash
docker compose up --build
```

---

## 5. Membuat Migration Baru (Alembic)

Setiap kali menambah/mengubah model di `backend/app/models/`, jalankan:

```bash
cd backend
alembic revision --autogenerate -m "deskripsi perubahan"
alembic upgrade head
```

Selalu review file migration hasil autogenerate sebelum di-apply ke production.

---

## 6. Deployment Ringkas

| Komponen | Platform | Catatan |
|---|---|---|
| Frontend | Vercel | Root Directory = `frontend`, domain baru (bukan domain lama) |
| Backend | Render | Root Directory = `backend`, deploy via Docker |
| Database | Supabase | PostgreSQL + Row Level Security per tabel |

Panduan lengkap step-by-step ada di **`ROADMAP.md`**.

---

## 7. Keamanan

- **Google OAuth 2.0**: satu-satunya metode login/register.
- **JWT**: access token (masa berlaku pendek) + refresh token (masa berlaku panjang), ditandatangani dengan `SECRET_KEY`.
- **Row Level Security (RLS)** di Supabase memastikan user hanya bisa membaca/menulis barisnya sendiri untuk tabel yang sensitif (lihat tabel pemetaan di atas).
- **Middleware** backend: request logging + exception handling terpusat. **Middleware** frontend: proteksi route privat di level edge.
- Jangan pernah commit file `.env` asli — hanya `.env.example` yang boleh masuk git.

---

## 8. Lisensi & Kontribusi

Proyek ini dibuat untuk keperluan edukasi/mahasiswa. Silakan fork dan kembangkan sesuai kebutuhan.
