"""
Middleware kustom aplikasi:
1. RequestLoggingMiddleware - mencatat setiap request masuk (metode, path, durasi, status).
2. ExceptionHandlingMiddleware - membungkus error tak terduga menjadi response JSON konsisten.

Middleware ini didaftarkan di app/main.py, urutan mendaftar penting
(middleware yang didaftar terakhir dieksekusi paling luar).
"""
import time
import uuid
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from app.utils.logger import get_logger

logger = get_logger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = str(uuid.uuid4())[:8]
        start_time = time.perf_counter()

        response = await call_next(request)

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.info(
            f"[{request_id}] {request.method} {request.url.path} "
            f"status={response.status_code} duration={duration_ms}ms"
        )
        response.headers["X-Request-ID"] = request_id
        return response


class ExceptionHandlingMiddleware(BaseHTTPMiddleware):
    """Menangkap exception yang lolos dari handler FastAPI agar tidak bocor stack trace ke client."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            return await call_next(request)
        except Exception as exc:  # noqa: BLE001 - sengaja generic, sudah paling luar
            logger.exception(f"Unhandled error at {request.url.path}: {exc}")
            from fastapi.responses import JSONResponse

            return JSONResponse(
                status_code=500,
                content={"detail": "Terjadi kesalahan pada server. Silakan coba lagi nanti."},
            )
