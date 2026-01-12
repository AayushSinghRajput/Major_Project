from fastapi import HTTPException, status
from utils.hashing import hash_password, verify_password
from utils.jwt_token import create_access_token
from config.config import db

users_collection = db["users"]


def register_user(username: str, email: str, password: str):
    # Check if email already exists
    if users_collection.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = hash_password(password)

    # Prepare user document
    user = {"username": username, "email": email, "password": hashed_password}

    # Insert user into MongoDB
    result = users_collection.insert_one(user)

    # Generate JWT token
    token = create_access_token({"user_id": str(result.inserted_id)})

    return {
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer"
    }


def login_user(email: str, password: str):
    # Find user by email
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

    # Generate JWT token
    token = create_access_token({"user_id": str(user["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


def logout_user():
    # JWT logout is client-side: delete token in frontend
    return {"message": "Logout successful"}
