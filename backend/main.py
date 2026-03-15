import logging
import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.middleware.rate_limit import RateLimitMiddleware
from backend.middleware.sanitizer import SanitizerMiddleware
from backend.middleware.integrity import IntegrityMiddleware
from backend.middleware.security import SecurityHeadersMiddleware
from backend.routers import search, alerts, ocr
from backend.storage.database import init_db
from backend.scheduler.engine import start_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up — initialising DB and scheduler")
    init_db()
    start_scheduler()
    yield
    logger.info("Shutting down")


app = FastAPI(
    title="Hunters Research Center API",
    version="2.0.0",
    lifespan=lifespan,
)

# ── Middleware (applied last-to-first) ────────────────────────────────────────
app.add_middleware(RateLimitMiddleware, limit=20, window=60)
app.add_middleware(IntegrityMiddleware)
app.add_middleware(SanitizerMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(search.router)
app.include_router(alerts.router)
app.include_router(ocr.router)

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
