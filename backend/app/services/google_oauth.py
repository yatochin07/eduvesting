"""
Service untuk menukar authorization code Google OAuth menjadi
access token & profil user (email, nama, foto, google 'sub' id).
Frontend hanya mengirim `code` yang didapat dari redirect Google,
semua pertukaran token terjadi di backend (lebih aman, client secret
tidak pernah terekspos ke browser).
"""
import httpx

from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


class GoogleOAuthService:
    async def exchange_code_for_profile(self, code: str) -> dict:
        async with httpx.AsyncClient(timeout=10) as client:
            token_resp = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )
            token_resp.raise_for_status()
            token_data = token_resp.json()

            userinfo_resp = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {token_data['access_token']}"},
            )
            userinfo_resp.raise_for_status()
            profile = userinfo_resp.json()

        return {
            "google_sub": profile["sub"],
            "email": profile["email"],
            "full_name": profile.get("name"),
            "avatar_url": profile.get("picture"),
        }


google_oauth_service = GoogleOAuthService()
