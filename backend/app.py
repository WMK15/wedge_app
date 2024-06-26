"""
API entrypoint for backend API.
"""
import os
from typing import List
from bson import ObjectId
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pymongo

from api_models.ai_request import AIRequest, AITaskRecommendation, AITaskRecommendationResponse
from api_models.wedge_models import Wedge
from wedgeapp.wedgeapp_ai_agent import WedgeAppAIAgent
from api_models.task_models import Subtask, Task, CreateTaskRequest, UpdateTaskRequest

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to the MongoDB database.
# Note: the connection string is stored in the .env file.
DB_CONNECTION_STRING = os.environ.get("DB_CONNECTION_STRING")
client = pymongo.MongoClient(DB_CONNECTION_STRING)
db = client.wedgeapp


# Agent pool keyed by session_id to retain memories/history in-memory.
# Note: the context is lost every time the service is restarted.
agent_pool = {
   "abc123": WedgeAppAIAgent("abc123")
}

@app.get("/")
def root():
    """
    Health probe endpoint.
    """
    return {"status": "ready"}

# AI recommendation endpoint
@app.post("/ai")
def run_wedgeapp_ai_agent(request: AIRequest):
    """
    Run the Cosmic Works AI agent.
    """
    if request.session_id not in agent_pool:
        agent_pool[request.session_id] = WedgeAppAIAgent(request.session_id)
    return { "message": agent_pool[request.session_id].run(request.prompt) }

@app.post("/tasks/ai")
def get_ai_recommendation(request: AITaskRecommendation):
    """
    Get AI recommendation for tasks.
    """
    if request.session_id not in agent_pool:
        agent_pool[request.session_id] = WedgeAppAIAgent(request.session_id)
    agent = agent_pool[request.session_id]

    print(request.task_name)
    subtasks = agent.get_task_recommendation(request.task_name)
    # Add dummy id and source to subtasks
    return subtasks

# CREATE Task
@app.post("/tasks", response_model=Task)
def create_task(request: CreateTaskRequest):
    """
    Create a new task.
    """
    task_data = request.model_dump()
    task_data["_id"] = ObjectId()
    for subtask in task_data.get("subtasks", []):
        if subtask.get("subTaskId") is None:
            subtask["subTaskId"] = "default_subtask_id"
    
    task = Task(**task_data)

    # Insert the task into the MongoDB collection and get the generated _id
    inserted_id = db.tasks.insert_one(task.model_dump()).inserted_id

    # Set the taskId to be the generated _id from MongoDB
    task.taskId = str(inserted_id)
    # If any subtasks are provided, generate subtask IDs for them by using the first 10 characters of the taskId and then adding a "_<index>"
    for i, subtask in enumerate(task.subtasks):
        subtask.subTaskId = f"{task.taskId[:10]}_{i}"
    # Update the task in the MongoDB collection with the generated subtask IDs
    db.tasks.update_one(
        {"_id": inserted_id},
        {"$set": task.model_dump()}
    )

    agent = agent_pool["abc123"]
    agent.add_content_vector_field("tasks", db, task.model_dump())

    return task
# READ Tasks
@app.get("/tasks", response_model=List[Task])
def get_all_tasks():
    """
    Get all tasks.
    """
    tasks = list(db.tasks.find({"completed": False}, {"contentVector": 0}))
    return tasks

# READ completed Tasks
@app.get("/tasks/completed", response_model=List[Task])
def get_completed_tasks():
    """
    Get all completed tasks.
    """
    tasks = list(db.tasks.find({"completed": True}, {"contentVector": 0}))
    return tasks

# READ Single Task
@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    """
    Get a task by ID.
    """
    task = db.tasks.find_one({"taskId": task_id})
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# UPDATE Task
@app.put("/tasks/{task_id}", )
def update_task(task_id: str, request: UpdateTaskRequest):
    """
    Update an existing task.
    """
    
    update_task = request.model_dump()
    result = db.tasks.find_one_and_update(
        {"taskId": task_id},
        {"$set": update_task},
        return_document=pymongo.ReturnDocument.AFTER
    )

    if (request.completed):
        wedge = db.bots.find_one({"session_id": "abc123"})
        if (wedge is None):
            raise HTTPException(status_code=404, detail="Wedge not found")
        wedge = Wedge(**wedge)
        wedge.xp += 10
        for level in wedge.levelXPs:
            if wedge.xp >= level["max_xp"] and not level["reached"]:
                level["reached"] = True
                wedge.level_up()
                break

        db.bots.find_one_and_update(
            {"session_id":"abc123"},
            {"$set": wedge.model_dump()}
        )
        
    if result is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return result

# DELETE Task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    """
    Delete a task by ID.
    """
    result = db.tasks.delete_one({"taskId": task_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "task deleted"}

# GET Bot
@app.get("/bots/{session_id}", response_model=Wedge)
def get_bot(session_id: str):
    """
    Get a bot by session ID.
    """
    bot = db.bots.find_one({"session_id": session_id})
    if bot is None:
        raise HTTPException(status_code=404, detail="Bot not found")
    bot = Wedge(**bot)
    return {
        "_id": bot.id,
        "session_id": bot.session_id,
        "xp": bot.xp,
        "level": bot.level,
        "levelMaxXP": bot.get_current_level_maxXP(),
    }