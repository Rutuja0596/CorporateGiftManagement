from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.gifts import Gift
from schemas.gifts import GiftCreate
from auth.dependencies import require_role, get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.post("/gift")
def create_gift(
    gift: GiftCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
 ):
    campaign = db.query(Campaign).filter(Campaign.id == gift.campaign_id).first()

    if not campaign:
        return {"error": "Campaign not found"}
    if not campaign or not campaign.is_active:
        return {"error": "Cannot add gifts to inactive campaign"}

    new_gift = Gift(
        name=gift.name,
        description=gift.description,
        campaign_id=gift.campaign_id
    )

    db.add(new_gift)
    db.commit()
    db.refresh(new_gift)

    return {"message": "Gift added"}

from models.campaign import Campaign

@router.get("/gifts/{campaign_id}")
def get_gifts(
    campaign_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()

    if not campaign:
        return {"error": "Campaign not found"}

    gifts = db.query(Gift).filter(Gift.campaign_id == campaign_id).all()

    return {
        "is_active": campaign.is_active,
        "gifts": gifts
    }

@router.put("/gift/{gift_id}")
def update_gift(
    gift_id: int,
    updated_data: dict,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    gift = db.query(Gift).filter(Gift.id == gift_id).first()

    if not gift:
        raise HTTPException(status_code=404, detail="Gift not found")

    gift.name = updated_data.get("name", gift.name)
    gift.description = updated_data.get("description", gift.description)

    db.commit()
    db.refresh(gift)

    return {"message": "Gift updated"}

@router.delete("/gift/{gift_id}")
def delete_gift(
    gift_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    gift = db.query(Gift).filter(Gift.id == gift_id).first()

    if not gift:
        raise HTTPException(status_code=404, detail="Gift not found")

    db.delete(gift)
    db.commit()

    return {"message": "Gift deleted"}