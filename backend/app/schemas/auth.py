from pydantic import BaseModel

from app.schemas.user import UserRead


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class GoogleAuthRequest(BaseModel):
    """Authorization code dari Google OAuth redirect di frontend."""
    code: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str
