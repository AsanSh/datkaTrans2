from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    telegram_id: str
    name: str
    phone: str

class User(UserCreate):
    role: str = "employee"
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    message: str

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None 