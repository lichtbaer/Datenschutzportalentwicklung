import hmac
import logging
from hashlib import sha256
from typing import Any, Iterable, MutableMapping, Optional

import orjson
import structlog

_DEFAULT_REDACT_KEYS = {
    "email",
    "uploader_email",
    "project_title",
    "institution",
    "filename",
    "file_name",
    "file_path",
    "path",
    "remote_path",
    "headers",  # can contain auth-ish values
}


def hmac_sha256_hex(value: str, secret: str) -> str:
    """
    Deterministic, non-reversible hash for limited PII logging.
    """
    return hmac.new(secret.encode("utf-8"), value.encode("utf-8"), sha256).hexdigest()


def _redact_processor(
    _: Any,
    __: str,
    event_dict: MutableMapping[str, Any],
    redact_keys: Iterable[str],
) -> MutableMapping[str, Any]:
    for k in redact_keys:
        if k in event_dict:
            event_dict[k] = "[redacted]"
    return event_dict


def _orjson_dumps(value: Any, **_: Any) -> str:
    return orjson.dumps(value).decode("utf-8")


def configure_logging(
    *,
    service_name: str,
    env: str,
    log_level: str = "INFO",
    redact_keys: Optional[Iterable[str]] = None,
) -> None:
    """
    Configure stdlib logging + structlog to emit JSON lines to stdout.
    Ensures uvicorn.* loggers use the same handler/formatter.
    """
    level = getattr(logging, str(log_level).upper(), logging.INFO)
    redact_keys_set = set(redact_keys or _DEFAULT_REDACT_KEYS)

    pre_chain = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso", key="ts"),
        structlog.stdlib.add_logger_name,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        lambda logger, method_name, event_dict: _redact_processor(
            logger, method_name, event_dict, redact_keys_set
        ),
        structlog.processors.UnicodeDecoder(),
    ]

    renderer = structlog.processors.JSONRenderer(serializer=_orjson_dumps)

    formatter = structlog.stdlib.ProcessorFormatter(
        processor=renderer,
        foreign_pre_chain=pre_chain,
    )

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level)

    # Make sure commonly noisy loggers don't re-emit / duplicate.
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logging.getLogger(name).handlers.clear()
        logging.getLogger(name).propagate = True
        logging.getLogger(name).setLevel(level)

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso", key="ts"),
            structlog.stdlib.add_logger_name,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            lambda logger, method_name, event_dict: _redact_processor(
                logger, method_name, event_dict, redact_keys_set
            ),
            structlog.processors.UnicodeDecoder(),
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Bind global context fields.
    structlog.contextvars.bind_contextvars(service=service_name, env=env)

