from typing import List
from bson import ObjectId
from pydantic import BaseModel, Field

from api_models.task_models import PyObjectId

class Wedge(BaseModel):
    """
    Wedge model encapsulates the bot's xp, level, and response.
    """
    id: PyObjectId = Field(alias="_id")
    session_id: str = Field(default="abc123")
    xp: int = Field(default=0)
    level: int = Field(default=1)
    levelXPs : List = [
        { "level": 1, "max_xp": 50, "reached": False },
        { "level": 2, "max_xp": 100, "reached": False },
        { "level": 3, "max_xp": 200, "reached": False },
        { "level": 4, "max_xp": 300, "reached": False },
        { "level": 5, "max_xp": 400, "reached": False },
        { "level": 6, "max_xp": 500, "reached": False },
        { "level": 7, "max_xp": 600, "reached": False },
        { "level": 8, "max_xp": 700, "reached": False },
        { "level": 9, "max_xp": 800, "reached": False },
        { "level": 10, "max_xp": 900, "reached": False }
    ]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda v: str(v)
        }

    def level_curve(self):
        """
        Calculate the level curve based on the xp.
        """
        return self.xp * 0.1
    
    def level_up(self):
        """
        Level up the bot.
        """
        self.xp = self.xp - self.levelXPs[self.level - 1]["max_xp"]
        self.level += 1
        return self
    
    def get_current_level(self):
        """
        Get the level xps.
        """
        return self.level
    
    def get_current_level_maxXP(self):
        """
        Get the current level max xp.
        """
        return self.levelXPs[self.level - 1]["max_xp"]
