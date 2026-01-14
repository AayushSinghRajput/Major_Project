<<<<<<< HEAD
from fastapi import HTTPException, status, Response
=======
from fastapi import HTTPException, status
>>>>>>> 3c2e0495d36b2f039816257eebab75ef78cf4452
from utils.hashing import hash_password, verify_password
from utils.jwt_token import create_access_token
from db.config import db

users_collection = db["users"]
<<<<<<< HEAD
COOKIE_NAME = "access_token"


def _set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,      # True in production
        samesite="lax",
        max_age=60 * 60 * 24
    )


def _serialize_user(user: dict):
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }


async def register_user(
    response: Response,
    username: str,
    email: str,
    password: str
):
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
=======


def register_user(username: str, email: str, password: str):
    # Check if email already exists
    if users_collection.find_one({"email": email}):
>>>>>>> 3c2e0495d36b2f039816257eebab75ef78cf4452
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

<<<<<<< HEAD
    hashed_password = hash_password(password)

    user_doc = {
        "username": username,
        "email": email,
        "password": hashed_password
    }

    result = await users_collection.insert_one(user_doc)

    token = create_access_token({"user_id": str(result.inserted_id)})
    _set_auth_cookie(response, token)

    user = {
        "_id": result.inserted_id,
        "username": username,
        "email": email
    }

    return {
        "success": True,
        "statusCode": 201,
        "message": "User registered successfully",
        "token": token,
        "user": _serialize_user(user)
    }


async def login_user(
    response: Response,
    email: str,
    password: str
):
    user = await users_collection.find_one({"email": email})

    if not user or not verify_password(password, user["password"]):
=======
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
>>>>>>> 3c2e0495d36b2f039816257eebab75ef78cf4452
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

<<<<<<< HEAD
    token = create_access_token({"user_id": str(user["_id"])})
    _set_auth_cookie(response, token)

    return {
        "success": True,
        "statusCode": 200,
        "message": "Login successful",
        "token": token,
        "user": _serialize_user(user)
    }


def logout_user(response: Response):
    response.delete_cookie(COOKIE_NAME)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Logout successful"
    }
=======
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
>>>>>>> 3c2e0495d36b2f039816257eebab75ef78cf4452
