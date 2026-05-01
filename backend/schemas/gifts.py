from pydantic import BaseModel

class GiftCreate(BaseModel):
    name: str
    description: str
    campaign_id: int