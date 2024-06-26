"""
AIRequest model
"""
from typing import List
from pydantic import BaseModel

from api_models.task_models import Subtask

class AIRequest(BaseModel):
    """
    AIRequest model encapsulates the session_id
    and incoming user prompt for the AI agent
    to respond to.
    """
    session_id: str
    prompt: str

class AITaskRecommendation(BaseModel):
    """
    AI Task Recommendation model encapsulates the
    recommended task and the confidence level of the
    recommendation.
    """
    session_id: str
    task_name: str

class AITaskRecommendationResponse(BaseModel):
    subtasks: List[Subtask]