from fastapi import Request, HTTPException, status
from utils.jwt_token import decode_access_token
from db.config import db
from bson import ObjectId

users_collection = db["users"]
COOKIE_NAME = "access_token"


async def get_current_user(request: Request):
    token = request.cookies.get(COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    payload = decode_access_token(token)

    if not payload or "user_id" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user = await users_collection.find_one(
        {"_id": ObjectId(payload["user_id"])},
        {"password": 0}
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }
