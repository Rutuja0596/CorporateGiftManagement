from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    # user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    description = Column(String)
    is_active = Column(Boolean, default=True)
    year = Column(Integer)