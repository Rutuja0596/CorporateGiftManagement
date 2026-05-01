from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from datetime import datetime
from models.campaign import Campaign
from models.user import User
from schemas.campaign import CampaignCreate
from auth.dependencies import get_current_user, require_role
from fastapi import HTTPException
from models.order import Order
from models.gifts import Gift
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.put("/campaign/deactivate-old")
def deactivate_old_campaigns(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
    ):
    current_year = datetime.now().year

    db.query(Campaign).filter(
        Campaign.year < current_year
    ).update({"is_active": False})

    db.commit()

    return {"message": "Old campaigns deactivated"}

@router.get("/campaigns")
def get_campaigns(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
 ):
    current_year = datetime.now().year

    campaigns = db.query(Campaign).filter(
        Campaign.year == current_year,
        Campaign.is_active == True
     ).all()

    return campaigns

@router.post("/campaign")
def create_campaign(
    campaign: CampaignCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    current_year = datetime.now().year

    campaign_exists = db.query(Campaign).filter( 
        Campaign.name == campaign.name,
        Campaign.year == current_year
    ).first()

    if campaign_exists:
        raise HTTPException(status_code=400, detail="Campaign with same name already exists")

    new_campaign = Campaign(
        name=campaign.name,
        description=campaign.description,
        year=current_year,
        is_active=True
    )

    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)

    return {
        "message": "Campaign created successfully",
        "campaign_id": new_campaign.id
    }

@router.put("/campaign/{id}/toggle")
def toggle_campaign(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    campaign = db.query(Campaign).filter(Campaign.id == id).first()

    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    campaign.is_active = not campaign.is_active

    db.commit()

    return {"message": "Campaign status updated"}

@router.get("/gifts/{campaign_id}")
def get_gifts(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()

    if not campaign:
        return {"gifts": [], "is_active": False}

    gifts = db.query(Gift).filter(Gift.campaign_id == campaign_id).all()

    return {
        "gifts": gifts,
        "is_active": campaign.is_active
    }