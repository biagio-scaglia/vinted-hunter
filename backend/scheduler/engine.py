import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from backend.services.registry import get as get_service
from backend.storage.database import SessionLocal, Alert, FoundItem

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler()


async def check_alerts() -> None:
    logger.info("Scheduler: running alert check")
    db = SessionLocal()
    try:
        alerts = db.query(Alert).all()
        for alert in alerts:
            try:
                vinted = get_service("vinted")
                if not vinted:
                    continue
                results = await vinted.search(
                    keyword=alert.keyword,
                    max_price=alert.max_price,
                )
                new_count = 0
                for item in results:
                    exists = (
                        db.query(FoundItem)
                        .filter(FoundItem.vinted_id == str(item.id))
                        .first()
                    )
                    if not exists:
                        db.add(
                            FoundItem(
                                alert_id=alert.id,
                                vinted_id=str(item.id),
                                title=item.title,
                                price=item.price,
                                link=item.link,
                            )
                        )
                        new_count += 1
                db.commit()
                if new_count:
                    logger.info("Alert %d (%r): %d new item(s)", alert.id, alert.keyword, new_count)
            except Exception:
                logger.exception("Error processing alert %d (%r)", alert.id, alert.keyword)
                db.rollback()
    except Exception:
        logger.exception("Fatal error in check_alerts")
    finally:
        db.close()


def start_scheduler() -> None:
    scheduler.add_job(check_alerts, "interval", minutes=10, id="check_alerts")
    scheduler.start()
    logger.info("Scheduler started (interval: 10 min)")
