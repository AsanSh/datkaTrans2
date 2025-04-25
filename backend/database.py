from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import Request

async def get_database(request: Request) -> AsyncIOMotorDatabase:
    return request.app.mongodb 