from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Generator

from backend.parser.logic import parse_search_query
from backend.storage.database import SessionLocal, Alert, FoundItem

router = APIRouter()


class AlertCreate(BaseModel):
    query: str


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/save-alert")
async def save_alert(request: AlertCreate, db=Depends(get_db)):
    params = parse_search_query(request.query)
    alert = Alert(
        query=request.query,
        keyword=params["keyword"],
        max_price=params["max_price"],
        condition=params["condition"],
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return {"id": alert.id, "status": "active"}


@router.get("/alerts")
async def get_alerts(db=Depends(get_db)):
    return db.query(Alert).all()


@router.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: int, db=Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"status": "removed"}


@router.get("/history")
async def get_history(db=Depends(get_db)):
    items = db.query(FoundItem).order_by(FoundItem.found_at.desc()).limit(50).all()
    return items
