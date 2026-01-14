from fastapi import APIRouter, Depends, Body
from backend.services.auth_service import register_user, login_user, logout_user
from middleware.authMiddleware import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register")
def register(
    username: str = Body(...),
    email: str = Body(...),
    password: str = Body(...)
):
    return register_user(username, email, password)


@router.post("/login")
def login(
    email: str = Body(...),
    password: str = Body(...)
):
    return login_user(email, password)


@router.post("/logout")
def logout(current_user: str = Depends(get_current_user)):
    return logout_user()
