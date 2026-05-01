from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user import User
from models.order import Order
from models.gifts import Gift
from models.campaign import Campaign


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/admin/orders")
def get_all_orders(db: Session = Depends(get_db)):
    data = db.query(Order, User, Gift, Campaign).join(
        User, Order.user_id == User.id
    ).join(
        Gift, Order.gift_id == Gift.id
    ).join(
        Campaign, Order.campaign_id == Campaign.id
    ).all()

    return [
        {
            "email": user.email,
            "campaign": campaign.name,
            "gift": gift.name,
            "status": order.status
        }
        for order, user, gift, campaign in data
    ]

@router.get("/admin/users")
def get_users(db: Session = Depends(get_db)):
    data = db.query(User, Order, Gift, Campaign).outerjoin(
        Order, User.id == Order.user_id
    ).outerjoin(
        Gift, Order.gift_id == Gift.id
    ).outerjoin(
        Campaign, Order.campaign_id == Campaign.id
    ).all()

    return [
        {
            "email": user.email,
            "campaign": campaign.name if campaign else "N/A",
            "gift": gift.name if gift else "Not Selected",
            "status": order.status if order else "Not Selected"
        }
        for user, order, gift, campaign in data
    ]