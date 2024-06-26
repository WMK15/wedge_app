import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Replace the following with your MongoDB connection string
load_dotenv("/.env")
connection_string = os.environ.get("DB_CONNECTION_STRING")
client = MongoClient(connection_string)

# Replace 'your_database_name' and 'your_collection_name' with your actual database and collection names
db = client['wedgeapp']
collection = db['tasks']

# Define the update operation to add the "completed" field with the value 'false' to all documents
update_operation = {"$set": {"completed": True}}

# Update all documents in the collection
result = collection.update_many({}, update_operation)

# Print the result of the update operation
print(f"Modified {result.modified_count} documents.")
