import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load ENV
load_dotenv()

# Get URI + DB name
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

# Create client
client = MongoClient(MONGO_URI)

# Database
db = client[DB_NAME]

# Collection
treatments_collection = db["treatments"]