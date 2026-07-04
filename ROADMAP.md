# ROADMAP — EduVesting v3

Panduan step-by-step dari nol (repo kosong) hingga aplikasi live di production.
Ikuti urutan fase di bawah; jangan loncat fase karena tiap fase bergantung pada fase sebelumnya.

---

## FASE 0 — Persiapan Akun & API Key

Sebelum coding, daftar/siapkan dulu semua akun & kredensial berikut:

1. **Supabase** → https://supabase.com → buat project baru → catat:
   - `Project URL`, `anon key`, `service_role key` (Settings → API)
   - `Connection string` database (Settings → Database → Connection string → URI)
2. **Google Cloud Console** → https://console.cloud.google.com
   - Buat project baru → APIs & Services → Credentials → **Create OAuth Client ID** (Web application)
   - Authorized redirect URIs: tambahkan `http://localhost:3000/login/callback` (local) dan nanti `https://<domain-baru>.vercel.app/login/callback` (production)
   - Catat `Client ID` & `Client Secret`
3. **Finnhub** → https://finnhub.io/register → catat API key (free tier cukup untuk saham US)
4. **CoinGecko** → https://www.coingecko.com/en/api → (opsional daftar demo key, free tier tanpa key juga bisa dipakai dengan rate limit lebih ketat)
5. **Groq** → https://console.groq.com → buat API key
6. **Vercel** → https://vercel.com → hubungkan akun GitHub
7. **Render** → https://render.com → hubungkan akun GitHub

---

## FASE 1 — Setup Repository

```bash
git init eduvesting-v3
cd eduvesting-v3
git remote add origin <url-repo-baru-anda>
```

Salin seluruh struktur folder `backend/` dan `frontend/` dari scaffold ini ke repo baru Anda.

```bash
git add .
git commit -m "chore: initial scaffold layered architecture"
git push -u origin main
```

---

## FASE 2 — Setup Database di Supabase

1. Buka Supabase Dashboard → SQL Editor.
2. Jangan buat tabel manual — tabel akan dibuat otomatis lewat **Alembic migration** dari backend (Fase 3). Supabase di sini hanya berperan sebagai host PostgreSQL.
3. Setelah migration pertama dijalankan (Fase 3) dan tabel-tabel sudah ada, aktifkan **Row Level Security (RLS)** sesuai tabel berikut lewat SQL Editor:

```sql
-- Tabel dengan RLS ENABLE (users hanya bisa akses baris miliknya sendiri)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocation_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Contoh policy generik (ganti nama tabel sesuai kebutuhan, ulangi untuk tiap tabel di atas)
CREATE POLICY "Users can manage own rows"
ON portfolio_assets
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Tabel dengan RLS DISABLE (dianggap non-sensitif / semi-publik per spesifikasi produk)
-- goals, education_contents, education_progress, market_watchlist_items, calculator_history
-- Tidak perlu ALTER TABLE ... ENABLE ROW LEVEL SECURITY untuk tabel-tabel ini.
```

> Catatan penting: karena backend memakai koneksi database langsung (SQLAlchemy dengan `service_role`/connection string biasa), enforcement RLS efektif berlaku pada level Supabase Auth (`auth.uid()`). Karena login utama app ini via JWT kustom EduVesting (bukan langsung Supabase Auth client), pastikan `users.id` yang dibuat backend SAMA dengan uuid yang dipetakan ke `auth.uid()` jika Anda ingin RLS berbasis Supabase Auth native. Alternatif yang lebih sederhana dan direkomendasikan untuk versi awal: terapkan filter `user_id` secara konsisten di level query backend (sudah dilakukan di setiap Repository/Service) sebagai baris pertahanan utama, dan aktifkan RLS sebagai baris pertahanan kedua dengan policy yang memvalidasi klaim JWT lewat `request.jwt.claims` (Supabase mendukung custom JWT verification — lihat dokumentasi Supabase "Custom JWT Auth").

---

## FASE 3 — Setup & Jalankan Backend Lokal

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
```

Isi `.env` dengan kredensial dari Fase 0:

```
SECRET_KEY=<hasil: openssl rand -hex 32>
DATABASE_URL=postgresql+psycopg2://postgres:<password>@db.xxxx.supabase.co:5432/postgres
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/login/callback
FINNHUB_API_KEY=...
GROQ_API_KEY=...
CORS_ORIGINS=http://localhost:3000
```

Jalankan migration pertama (ini akan membuat semua tabel di Supabase):

```bash
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

Jalankan server:

```bash
uvicorn app.main:app --reload
```

Cek `http://localhost:8000/docs` — pastikan semua endpoint muncul di Swagger UI.

---

## FASE 4 — Setup & Jalankan Frontend Lokal

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Isi `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<sama dengan GOOGLE_CLIENT_ID backend>
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/login/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

Buka `http://localhost:3000` → klik "Masuk" → coba alur Google OAuth end-to-end.

---

## FASE 5 — Isi Konten Awal (Seed Data)

Beberapa tabel butuh data awal supaya halaman tidak kosong saat testing:

- **education_contents**: tambahkan beberapa artikel edukasi lewat Supabase Table Editor atau buat endpoint admin sederhana (`POST /education` khusus untuk seed, bisa dilepas nanti untuk keamanan produksi).
- **allocation presets**: sudah tersedia hardcode di `GET /allocation/presets`, tidak perlu seed database.

---

## FASE 6 — Testing Menyeluruh Sebelum Deploy

Checklist manual per halaman:

- [ ] Login/Register via Google berhasil, token tersimpan
- [ ] Dashboard menampilkan ringkasan dari Portfolio + Transaction + Goals
- [ ] Portfolio: tambah aset tiap jenis (us_stock, idx_stock, crypto, gold, mutual_fund), harga realtime muncul
- [ ] Transaction: CRUD berjalan, tidak ada pemanggilan API eksternal
- [ ] Goals: progress bar menghitung benar
- [ ] Allocation: bisa pilih preset & custom
- [ ] Insight: generate insight AI berhasil, histori tersimpan
- [ ] Edukasi: konten publik tampil tanpa login
- [ ] Market: widget TradingView render dengan benar
- [ ] Calculator: hasil proyeksi sesuai rumus compound interest
- [ ] Settings: update profil berhasil

Jalankan test otomatis backend:

```bash
cd backend && pytest
```

---

## FASE 7 — Deploy Backend ke Render

1. Render Dashboard → **New → Web Service** → pilih repo GitHub Anda.
2. **Root Directory**: `backend`
3. **Runtime**: Docker (Render otomatis mendeteksi `Dockerfile`)
4. **Region**: pilih terdekat (mis. Singapore)
5. Isi **Environment Variables** (samakan dengan `.env` lokal, tapi pakai domain production):
   - `ENVIRONMENT=production`, `DEBUG=false`
   - `DATABASE_URL`, `SECRET_KEY`, `GOOGLE_CLIENT_ID/SECRET`
   - `GOOGLE_REDIRECT_URI=https://<domain-baru>.vercel.app/login/callback`
   - `CORS_ORIGINS=https://<domain-baru>.vercel.app`
   - `FINNHUB_API_KEY`, `COINGECKO_API_KEY`, `GROQ_API_KEY`
   - `FRONTEND_URL=https://<domain-baru>.vercel.app`
6. Deploy. Setelah selesai, jalankan migration di production (via Render Shell atau job terpisah):
   ```bash
   alembic upgrade head
   ```
7. Catat URL backend production, contoh: `https://eduvesting-backend.onrender.com`
8. (Opsional) Ambil **Deploy Hook URL** dari Render → Settings, masukkan sebagai secret `RENDER_DEPLOY_HOOK_URL` di GitHub repo untuk CI/CD.

---

## FASE 8 — Deploy Frontend ke Vercel (Domain Baru)

1. Vercel Dashboard → **Add New → Project** → import repo GitHub.
2. **Root Directory**: `frontend`
3. Framework Preset: Next.js (otomatis terdeteksi)
4. Isi **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL=https://eduvesting-backend.onrender.com/api/v1`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://<domain-baru>.vercel.app/login/callback`
   - `NEXT_PUBLIC_APP_URL=https://<domain-baru>.vercel.app`
5. Deploy.
6. **Setup domain baru** (bukan domain lama `manajemen-investasi-mahasiswa-v2.vercel.app`):
   - Project Settings → Domains → tambahkan domain custom Anda, atau gunakan subdomain `.vercel.app` baru dengan mengubah nama project.
7. Update `GOOGLE_REDIRECT_URI` di Google Cloud Console + Render env var jika domain final berbeda dari saat testing.

---

## FASE 9 — Setup CI/CD (GitHub Actions)

1. Repo Settings → Secrets and variables → Actions → tambahkan:
   - `RENDER_DEPLOY_HOOK_URL`
   - `VERCEL_TOKEN` (dari Vercel Account Settings → Tokens) — opsional jika ingin deploy lewat Actions selain auto-deploy bawaan Vercel
   - `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`, `NEXT_PUBLIC_APP_URL` (untuk build check di Actions)
2. Workflow sudah tersedia di `.github/workflows/backend-ci.yml` dan `frontend-ci.yml` — otomatis jalan setiap push ke `main` yang menyentuh folder terkait.
3. Vercel & Render sebenarnya sudah punya auto-deploy bawaan begitu terhubung ke GitHub repo — job "deploy" di Actions bersifat opsional/tambahan kontrol (misal ingin deploy hanya setelah test lolos).

---

## FASE 10 — Pasca Deploy

- [ ] Uji ulang seluruh checklist Fase 6 di environment production
- [ ] Cek CORS tidak diblokir (buka DevTools → Network saat memakai domain production)
- [ ] Cek RLS Supabase tidak memblokir query yang sah (test dengan 2 akun user berbeda, pastikan tidak bisa saling melihat data)
- [ ] Setup monitoring dasar (Render metrics, Vercel Analytics)
- [ ] Backup database berkala (Supabase → Database → Backups)

---

## Rencana Pengembangan Lanjutan (Opsional)

- Tambah rate-limiting di backend untuk endpoint market data (hindari hit limit Finnhub/CoinGecko).
- Tambah caching (Redis) untuk quote realtime dengan TTL pendek (mengurangi panggilan API eksternal berulang).
- Tambah notifikasi (email/push) saat goal tercapai atau harga aset menyentuh threshold tertentu.
- Tambah export laporan (PDF/Excel) untuk transaksi & portofolio.
- Tambah dark mode di frontend.
