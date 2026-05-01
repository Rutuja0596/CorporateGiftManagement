from sqlalchemy import Column, Integer, ForeignKey, String
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    gift_id = Column(Integer, ForeignKey("gifts.id"))
    gift_name = Column(String)
    status = Column(String, default="PENDING")