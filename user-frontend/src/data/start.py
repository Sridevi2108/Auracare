import json
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Update if using a remote database
db = client["auracare"]  # Your database name
music_collection = db["music"]  # Collection where quiz data will be stored

# Read the quiz data from the JSON file
with open('musicTracks.json', 'r') as file:
    quiz_data = json.load(file)

# Insert the quiz data into the MongoDB collection
try:
    result = music_collection.insert_many(quiz_data)  # Inserts multiple documents
    print(f"Quiz data inserted successfully with IDs: {result.inserted_ids}")
except Exception as e:
    print(f"Error inserting quiz data: {str(e)}")
