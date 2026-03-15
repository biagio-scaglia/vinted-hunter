import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from backend.services.vinted import vinted_service
from backend.storage.database import SessionLocal, Alert, FoundItem
from datetime import datetime

scheduler = AsyncIOScheduler()

async def check_alerts():
    db = SessionLocal()
    try:
        alerts = db.query(Alert).all()
        for alert in alerts:
            results = await vinted_service.search(
                keyword=alert.keyword, 
                max_price=alert.max_price
            )
            
            for item in results:
                existing = db.query(FoundItem).filter(FoundItem.vinted_id == str(item.id)).first()
                if not existing:
                    db.add(FoundItem(
                        alert_id=alert.id,
                        vinted_id=str(item.id),
                        title=item.title,
                        price=item.price,
                        link=item.link
                    ))
            db.commit()
                    
    except Exception:
        pass
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(check_alerts, 'interval', minutes=10)
    scheduler.start()
