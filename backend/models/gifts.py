from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Gift(Base):
    __tablename__ = "gifts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))