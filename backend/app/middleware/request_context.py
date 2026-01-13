import time
import uuid
from typing import Callable

import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = structlog.get_logger(__name__)


def _get_or_create_request_id(request: Request) -> str:
    incoming = request.headers.get("x-request-id")
    return incoming.strip() if incoming else str(uuid.uuid4())


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = _get_or_create_request_id(request)
        structlog.contextvars.bind_contextvars(request_id=request_id)

        start = time.perf_counter()
        status_code = 500
        try:
            response = await call_next(request)
            status_code = response.status_code
            return response
        finally:
            duration_ms = int((time.perf_counter() - start) * 1000)
            # Ensure response always has the ID (if response exists).
            try:
                if "response" in locals():
                    response.headers["X-Request-ID"] = request_id
            except Exception:
                pass

            logger.info(
                "request_completed",
                method=request.method,
                path=request.url.path,
                status_code=status_code,
                duration_ms=duration_ms,
            )
            structlog.contextvars.unbind_contextvars("request_id")

