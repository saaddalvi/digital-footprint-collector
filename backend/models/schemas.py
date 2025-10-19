from pydantic import BaseModel, Field
from typing import Literal, Optional

class SearchRequest(BaseModel):
    query: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    type: Literal['username', 'email', 'name']
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "johndoe",
                "type": "username"
            }
        }

class SearchResponse(BaseModel):
    query: str
    type: str
    results: dict
    timestamp: str