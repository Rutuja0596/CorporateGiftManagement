from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.order import Order
from schemas.orders import OrderCreate
from models.user import User
from models.gifts import Gift
from auth.dependencies import get_current_user, require_role

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# @router.post("/orders")
# def select_gift(
#     data: OrderCreate,
#     db: Session = Depends(get_db),
#     user=Depends(get_current_user)
#  ):
#     db_user = db.query(User).filter(User.email == user["email"]).first()

#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")

#     campaign_id = data.get("campaign_id")
#     gift_id = data.get("gift_id")

#     existing_order = db.query(Order).filter(
#         Order.user_id == db_user.id,
#         Order.campaign_id == campaign_id
#     ).first()

#     if existing_order:
#         raise HTTPException(
#             status_code=400,
#             detail="You already selected a gift for this campaign"
#         )

#     new_order = Order(
#         user_id=db_user.id,
#         campaign_id=campaign_id,
#         gift_id=gift_id,
#         status="SELECTED"
#     )

#     db.add(new_order)
#     db.commit()

#     return {"message": "Gift selected successfully"}

@router.post("/orders")
def select_gift(
    data: OrderCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    db_user = db.query(User).filter(User.email == user["email"]).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ FIX HERE
    campaign_id = data.campaign_id
    gift_id = data.gift_id

    existing_order = db.query(Order).filter(
        Order.user_id == db_user.id,
        Order.campaign_id == campaign_id
    ).first()

    if existing_order:
        raise HTTPException(
            status_code=400,
            detail="You already selected a gift for this campaign"
        )

    new_order = Order(
        user_id=db_user.id,
        campaign_id=campaign_id,
        gift_id=gift_id,
        status="SELECTED"
    )

    db.add(new_order)
    db.commit()

    return {"message": "Gift selected successfully"}

@router.get("/all-orders")
def get_all_orders(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    orders = db.query(Order).all()

    result = []

    for o in orders:
        gift = db.query(Gift).filter(Gift.id == o.gift_id).first()
        user = db.query(User).filter(User.id == o.user_id).first()

        result.append({
            "id": o.id,
            "user_email": user.email,
            "gift_name": gift.name if gift else "N/A",
            "status": o.status
        })

    return result

@router.get("/my-order")
def my_order(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
 ):
    db_user = db.query(User).filter(User.email == user["email"]).first()
    order = db.query(Order).filter(Order.user_id == db_user.id).first()

    if not order:
        return {"message": "No order"}

    gift = db.query(Gift).filter(Gift.id == order.gift_id).first()

    return {
        "order_id": order.id,
        "gift_name": gift.name,
        "status": order.status
    }
    

@router.get("/orders/my/{campaign_id}")
def get_my_order(
    campaign_id: int,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == user["email"]).first()

    order = db.query(Order).filter(
        Order.user_id == db_user.id,
        Order.campaign_id == campaign_id
    ).first()

    if not order:
        return {}

    return {
        "gift_id": order.gift_id
    }