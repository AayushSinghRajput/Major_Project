from fastapi import FastAPI
from routes import auth
from routes import content
from routes import pdf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Virtual Teacher",
    description="AI Teacher that converts textbooks into daily lessons",
    version="1.0.0",
)

# Allow CORS (Optional)
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(pdf.router)
app.include_router(content.router)



@app.get("/")
def root():
    return {"message": "Backend is running"}
