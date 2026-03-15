from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

_GUARDED_PATHS = {"/search", "/save-alert"}
_SECRET = "secure-radar-v2"


class IntegrityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.url.path in _GUARDED_PATHS:
            if request.headers.get("X-Radar-Integrity") != _SECRET:
                return JSONResponse(status_code=403, content={"detail": "Unauthorized Access - Radar Guard Active"})
        return await call_next(request)
