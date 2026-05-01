from pydantic import BaseModel

class CampaignCreate(BaseModel):
    name: str
    description: str