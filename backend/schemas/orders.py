from pydantic import BaseModel

class OrderCreate(BaseModel):
    campaign_id: int
    gift_id: int