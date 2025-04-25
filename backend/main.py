from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List, Optional
import os
from dotenv import load_dotenv
from models import User, UserCreate, UserResponse, AdminLogin
from auth import create_access_token, get_current_admin
from database import get_database
from utils import validate_telegram_webapp_data

# Load environment variables
load_dotenv()

app = FastAPI(title="Employee Registration System")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
    app.mongodb = app.mongodb_client.employee_registration

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

# Routes
@app.post("/register", response_model=UserResponse)
async def register_employee(
    user: UserCreate,
    telegram_init_data: Optional[str] = Header(None),
    db=Depends(get_database)
):
    # Validate Telegram Web App data
    if not telegram_init_data:
        raise HTTPException(
            status_code=400,
            detail="Telegram Web App data is required"
        )
    
    telegram_user = validate_telegram_webapp_data(telegram_init_data)
    if not telegram_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid Telegram Web App data"
        )
    
    # Verify that the Telegram ID matches
    if str(telegram_user.get('id')) != user.telegram_id:
        raise HTTPException(
            status_code=400,
            detail="Telegram ID mismatch"
        )
    
    # Check if user already exists
    existing_user = await db.users.find_one({"telegram_id": user.telegram_id})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this Telegram ID already exists"
        )
    
    # Create new user
    new_user = User(
        telegram_id=user.telegram_id,
        name=user.name,
        phone=user.phone,
        role="employee",
        status="pending",
        created_at=datetime.utcnow()
    )
    
    await db.users.insert_one(new_user.dict())
    return UserResponse(message="Registration request sent successfully")

@app.post("/admin/login")
async def admin_login(login_data: AdminLogin):
    if (login_data.username == os.getenv("ADMIN_USERNAME") and 
        login_data.password == os.getenv("ADMIN_PASSWORD")):
        access_token = create_access_token(data={"sub": login_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password"
    )

@app.get("/admin/requests", response_model=List[User])
async def get_pending_requests(
    current_admin: str = Depends(get_current_admin),
    db=Depends(get_database)
):
    requests = await db.users.find({"status": "pending"}).to_list(length=100)
    return requests

@app.post("/admin/approve/{user_id}")
async def approve_request(
    user_id: str,
    current_admin: str = Depends(get_current_admin),
    db=Depends(get_database)
):
    result = await db.users.update_one(
        {"telegram_id": user_id},
        {"$set": {"status": "approved"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User approved successfully"}

@app.post("/admin/reject/{user_id}")
async def reject_request(
    user_id: str,
    current_admin: str = Depends(get_current_admin),
    db=Depends(get_database)
):
    result = await db.users.update_one(
        {"telegram_id": user_id},
        {"$set": {"status": "rejected"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User rejected successfully"}

@app.get("/user/status/{telegram_id}")
async def get_user_status(telegram_id: str, db=Depends(get_database)):
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": user["status"]} 