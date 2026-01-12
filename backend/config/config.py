from pymongo import MongoClient
from core.config import settings



MONGO_URI = settings.MONGO_URI
DB_NAME = settings.DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

print("MongoDB connected!")
