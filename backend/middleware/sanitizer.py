import re
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

_MALICIOUS = re.compile(
    r"<script|javascript:|on\w+=|union\s+select|insert\s+into",
    re.IGNORECASE,
)


class SanitizerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.method in ("POST", "PUT"):
            body = await request.body()
            if body and _MALICIOUS.search(body.decode("utf-8", errors="ignore")):
                return JSONResponse(status_code=403, content={"detail": "Malicious Payload Blocked"})
        return await call_next(request)
