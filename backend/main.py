from fastapi import FastAPI, HTTPException, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from backend.parser.logic import parse_search_query
from backend.services.vinted import vinted_service
from backend.storage.database import SessionLocal, init_db, Alert, FoundItem
from backend.scheduler.engine import start_scheduler
from backend.models import ProductResponse
import uvicorn
import re

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit: int = 10, window: int = 60, ban_threshold: int = 5):
        super().__init__(app)
        self.limit = limit
        self.window = window
        self.ban_threshold = ban_threshold
        self.requests: Dict[str, List[float]] = {}
        self.violations: Dict[str, int] = {}
        self.banned_ips: Dict[str, float] = {}

    async def dispatch(self, request, call_next):
        client_ip = request.client.host
        now = time.time()
        
        if client_ip in self.banned_ips:
            if now - self.banned_ips[client_ip] < 86400:
                return JSONResponse(status_code=403, content={"detail": "IP Banned - Cyber Shield Active"})
            else:
                del self.banned_ips[client_ip]
                self.violations[client_ip] = 0

        if client_ip not in self.requests:
            self.requests[client_ip] = []
            
        self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < self.window]
        
        if len(self.requests[client_ip]) >= self.limit:
            self.violations[client_ip] = self.violations.get(client_ip, 0) + 1
            if self.violations[client_ip] >= self.ban_threshold:
                self.banned_ips[client_ip] = now
                return JSONResponse(status_code=403, content={"detail": "IP Banned for 24h - Excessive Violations"})
            return JSONResponse(status_code=429, content={"detail": "Too Many Requests - Radar Overload"})
            
        self.requests[client_ip].append(now)
        return await call_next(request)

class SanitizerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.method in ["POST", "PUT"]:
            body = await request.body()
            if body:
                text = body.decode("utf-8", errors="ignore")
                if re.search(r"<script|javascript:|on\w+=|union\s+select|insert\s+into", text, re.IGNORECASE):
                    return JSONResponse(status_code=403, content={"detail": "Malicious Payload Blocked"})
        return await call_next(request)

class IntegrityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.url.path in ["/search", "/save-alert"]:
            integrity = request.headers.get("X-Radar-Integrity")
            if integrity != "secure-radar-v2":
                return JSONResponse(status_code=403, content={"detail": "Unauthorized Access - Radar Guard Active"})
        return await call_next(request)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        csp_connect = " ".join([f"http://localhost:*" , f"https://*"])
        response.headers["Content-Security-Policy"] = f"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*; connect-src 'self' {csp_connect};"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    start_scheduler()
    yield

app = FastAPI(
    title="Hunters Research Center API", 
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(RateLimitMiddleware, limit=20, window=60)
app.add_middleware(IntegrityMiddleware)
app.add_middleware(SanitizerMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str

class AlertCreate(BaseModel):
    query: str

@app.post("/search")
async def search(request: SearchRequest):
    params = parse_search_query(request.query)
    
    vinted_results = await vinted_service.search(
        keyword=params['keyword'],
        max_price=params['max_price'],
        condition=params['condition']
    )
    
    all_results = sorted(vinted_results, key=lambda x: x.raw_price)
    
    return {
        "params": params,
        "results": [r.dict() for r in all_results]
    }



@app.post("/save-alert")
async def save_alert(request: AlertCreate):
    params = parse_search_query(request.query)
    db = SessionLocal()
    try:
        new_alert = Alert(
            query=request.query,
            keyword=params['keyword'],
            max_price=params['max_price'],
            condition=params['condition']
        )
        db.add(new_alert)
        db.commit()
        return {"id": new_alert.id, "status": "active"}
    finally:
        db.close()

@app.get("/alerts")
async def get_alerts():
    db = SessionLocal()
    try:
        alerts = db.query(Alert).all()
        return alerts
    finally:
        db.close()

@app.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: int):
    db = SessionLocal()
    try:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        db.delete(alert)
        db.commit()
        return {"status": "removed"}
    finally:
        db.close()

@app.get("/history")
async def get_history():
    db = SessionLocal()
    try:
        items = db.query(FoundItem).order_by(FoundItem.found_at.desc()).limit(50).all()
        return items
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
