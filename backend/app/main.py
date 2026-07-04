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

# Urutan penting: middleware yang didaftar terakhir = paling luar (dieksekusi pertama)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or [settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(ExceptionHandlingMiddleware)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
