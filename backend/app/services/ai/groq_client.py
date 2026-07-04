"""
Client untuk Groq AI - dipakai di halaman Insight untuk menganalisis
jejak finansial user (portfolio, transaksi, goals, allocation) dan
menghasilkan ringkasan + rekomendasi dalam bahasa Indonesia.
Docs: https://console.groq.com/docs/api-reference#chat-create
"""
import json

import httpx

from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = (
    "Anda adalah asisten keuangan pribadi untuk mahasiswa Indonesia. "
    "Analisis data keuangan yang diberikan (portofolio, transaksi, target, alokasi) "
    "dan berikan ringkasan singkat serta rekomendasi praktis dalam Bahasa Indonesia. "
    "Selalu jawab HANYA dalam format JSON valid dengan struktur: "
    '{"summary": string, "recommendations": [{"title": string, "detail": string}]}. '
    "Jangan menyertakan teks lain di luar JSON."
)


class GroqClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL

    async def generate_insight(self, financial_context: dict) -> dict:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Berikut data keuangan user dalam format JSON:\n{json.dumps(financial_context, default=str)}",
                },
            ],
            "temperature": 0.4,
            "response_format": {"type": "json_object"},
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(GROQ_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()

        content = data["choices"][0]["message"]["content"]
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            logger.error(f"Gagal parse JSON dari Groq: {content}")
            parsed = {"summary": content, "recommendations": []}

        return parsed


groq_client = GroqClient()
