from datetime import datetime, timedelta
import os
from typing import Optional

from passlib.context import CryptContext
from jose import jwt, JWTError

# Use a scheme that doesn't require the bcrypt C-extension to avoid
# platform-specific installation issues during testing. PBKDF2-SHA256 is
# widely supported and secure for typical demo/test usage.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_password_hash(password: str) -> str:
    # ensure we operate on a str and not some unexpected type
    if password is None:
        password = ""
    return pwd_context.hash(str(password))

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(str(plain), hashed)
    except Exception:
        return False

# JWT helpers
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = {"sub": subject}
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
