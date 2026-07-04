"""
Konfigurasi aplikasi terpusat menggunakan Pydantic Settings.
Semua nilai wajib diambil dari environment variable (.env),
JANGAN pernah hardcode secret di sini.
"""
from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- App ---
    APP_NAME: str = "EduVesting API"
    ENVIRONMENT: str = "local"  # local | production
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True

    # --- Security / JWT ---
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 hari
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # --- Database (Supabase Postgres) ---
    DATABASE_URL: str  # postgresql+psycopg2://user:pass@host:port/dbname
    SUPABASE_URL: str | None = None
    SUPABASE_SERVICE_ROLE_KEY: str | None = None
    SUPABASE_ANON_KEY: str | None = None

    # --- Google OAuth ---
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    # --- CORS ---
    CORS_ORIGINS: List[AnyHttpUrl] | List[str] = []

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def split_cors(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # --- External API keys ---
    FINNHUB_API_KEY: str
    COINGECKO_API_KEY: str | None = None  # optional, free tier tidak wajib
    COINGECKO_BASE_URL: str = "https://api.coingecko.com/api/v3"
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # --- Rate limit / cache ---
    MARKET_CACHE_TTL_SECONDS: int = 60

    # --- Frontend URL (untuk redirect OAuth & CORS) ---
    FRONTEND_URL: str = "http://localhost:3000"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
