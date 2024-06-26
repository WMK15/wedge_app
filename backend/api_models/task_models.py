from typing import Annotated, Any, List, Optional, Union
from bson import ObjectId
from fastapi.encoders import ENCODERS_BY_TYPE
from pydantic import AfterValidator, BaseModel, Field, PlainSerializer, WithJsonSchema

def validate_object_id(v: Any) -> ObjectId:
    if isinstance(v, ObjectId):
        return v
    if ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("Invalid ObjectId")

PyObjectId = Annotated[
    Union[str, ObjectId],
    AfterValidator(validate_object_id),
    PlainSerializer(lambda x: str(x), return_type=str),
    WithJsonSchema({"type": "string"}, mode="serialization"),
]

# Custom encoder function for ObjectId
def objectid_encoder(obj: ObjectId):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

# Update Pydantic's encoder to handle ObjectId
ENCODERS_BY_TYPE[ObjectId] = objectid_encoder

class Subtask(BaseModel):
    subTaskId: str = Field(default=None)
    name: str = Field(default=None)
    source: str = Field(default=None)

    class Config:
        json_encoders = {
            ObjectId: lambda v: str(v)
        }

class SubtaskDependency(BaseModel):
    parent: str
    child: str

class Task(BaseModel):
    id: PyObjectId = Field(alias="_id")
    taskId: str = Field(default=None)
    task: str
    subtasks: Optional[List[Subtask]] = []
    subtask_order_matters: bool = False
    subtask_dependencies: Optional[List[SubtaskDependency]] = [] if subtask_order_matters else None
    completed: bool = False

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda v: str(v)
        }

class UpdateTaskRequest(BaseModel):
    taskId: str
    task: str
    subtasks: Optional[List[Subtask]] = []
    subtask_order_matters: bool = False
    subtask_dependencies: Optional[List[SubtaskDependency]] = [] if subtask_order_matters else None
    completed: bool = False   

class CreateTaskRequest(BaseModel):
    task: str
    subtasks: Optional[List[Subtask]] = []
    subtask_order_matters: bool = False
    subtask_dependencies: Optional[List[SubtaskDependency]] = []
