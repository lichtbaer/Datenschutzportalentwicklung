from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Literal, Any
import json

class Settings(BaseSettings):
    # Allow unrelated env vars (e.g. TZ/LOG_LEVEL/VITE_*) without crashing
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Logging
    log_level: str = "INFO"
    env: str = "dev"
    service_name: str = "datenschutzportal-backend"
    # Used for HMAC hashing of PII (e.g. email_hash). Must be set in production.
    log_redaction_secret: str = "change-me"

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_debug: bool = False
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _parse_cors_origins(cls, v: Any) -> Any:
        """
        Accept both JSON arrays and comma-separated strings, e.g.
        - CORS_ORIGINS='["https://ds.niceai.de","http://localhost:3000"]'
        - CORS_ORIGINS='https://ds.niceai.de,http://localhost:3000'
        """
        if v is None or isinstance(v, list):
            return v
        if isinstance(v, str):
            s = v.strip()
            if not s:
                return []
            if s.startswith("["):
                try:
                    return json.loads(s)
                except Exception:
                    # Fall back to comma-separated parsing
                    pass
            return [item.strip() for item in s.split(",") if item.strip()]
        return v
    
    # Nextcloud
    nextcloud_url: str
    nextcloud_username: str
    nextcloud_password: str
    nextcloud_base_path: str = "/Datenschutzportal"
    
    # SMTP
    smtp_host: str
    smtp_port: int = 587
    smtp_username: str
    smtp_password: str
    smtp_from_email: str
    smtp_from_name: str = "Datenschutzportal"
    smtp_encryption: Literal["starttls", "ssl", "none"] = "starttls"
    
    # Notifications
    notification_emails: List[str]
    
    # Security
    secret_key: str
    api_token: str
    algorithm: str = "HS256"
    
    # File Upload
    max_file_size: int = 52428800  # 50 MB
    allowed_file_types: List[str] = [".pdf", ".doc", ".docx", ".zip", ".odt", ".ods", ".odp", ".png", ".jpg", ".jpeg"]

settings = Settings()
