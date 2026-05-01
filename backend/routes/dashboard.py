from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.order import Order
from models.campaign import Campaign
from models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()

    selected_users = db.query(Order.user_id).distinct().count()

    active_campaigns = db.query(Campaign).filter(
        Campaign.is_active == True
    ).count()

    return {
        "total_users": total_users,
        "selected_users": selected_users,
        "active_campaigns": active_campaigns
    }

