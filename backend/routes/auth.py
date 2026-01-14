from fastapi import APIRouter, Depends, Body, Response
from services.auth_service import register_user, login_user, logout_user
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", status_code=201)
async def register(
    response: Response,
    username: str = Body(...),
    email: str = Body(...),
    password: str = Body(...)
):
    return await register_user(response, username, email, password)


@router.post("/login", status_code=200)
async def login(
    response: Response,
    email: str = Body(...),
    password: str = Body(...)
):
    return await login_user(response, email, password)


@router.get("/me", status_code=200)
async def get_me(current_user=Depends(get_current_user)):
    return {
        "success": True,
        "statusCode": 200,
        "message": "User fetched successfully",
        "user": current_user
    }


@router.post("/logout", status_code=200)
async def logout(response: Response):
    return logout_user(response)
