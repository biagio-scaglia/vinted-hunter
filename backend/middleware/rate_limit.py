import time
from typing import Dict, List
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit: int = 20, window: int = 60, ban_threshold: int = 5):
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
            del self.banned_ips[client_ip]
            self.violations[client_ip] = 0

        self.requests.setdefault(client_ip, [])
        self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < self.window]

        if len(self.requests[client_ip]) >= self.limit:
            self.violations[client_ip] = self.violations.get(client_ip, 0) + 1
            if self.violations[client_ip] >= self.ban_threshold:
                self.banned_ips[client_ip] = now
                return JSONResponse(status_code=403, content={"detail": "IP Banned for 24h - Excessive Violations"})
            return JSONResponse(status_code=429, content={"detail": "Too Many Requests - Radar Overload"})

        self.requests[client_ip].append(now)
        return await call_next(request)
