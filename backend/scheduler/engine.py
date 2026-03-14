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
            
            if results:
                cheapest = results[0]
                existing = db.query(FoundItem).filter(FoundItem.vinted_id == str(cheapest.id)).first()
                
                if not existing:
                    new_item = FoundItem(
                        alert_id=alert.id,
                        vinted_id=str(cheapest.id),
                        title=cheapest.title,
                        price=cheapest.price,
                        link=cheapest.link
                    )
                    db.add(new_item)
                    db.commit()
                    
    except Exception:
        pass
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(check_alerts, 'interval', minutes=10)
    scheduler.start()
