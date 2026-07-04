"""
Entrypoint aplikasi FastAPI EduVesting.
Menjalankan lokal: uvicorn app.main:app --reload
Production (Render): uvicorn app.main:app --host 0.0.0.0 --port $PORT
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.middleware import ExceptionHandlingMiddleware, RequestLoggingMiddleware

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Backend API EduVesting - Manajemen Investasi & Keuangan Mahasiswa",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
)

# KUNCI PERBAIKAN CORS: Kita masukkan list origin localhost secara eksplisit
# agar tidak bergantung penuh pada kevalidan file .env saat development lokal
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if settings.CORS_ORIGINS:
    origins.extend(settings.CORS_ORIGINS)
elif settings.FRONTEND_URL:
    origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Menggunakan list origins yang sudah pasti aman untuk lokal
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(ExceptionHandlingMiddleware)

# Mendaftarkan router dengan prefix /api/v1
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}