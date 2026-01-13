from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings



MONGO_URI = settings.MONGO_URI
DB_NAME = settings.DB_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

pdf_collection = db.pdfs
schedule_collection = db.schedules
subtopic_collection = db.subtopics

print("MongoDB connected!")
