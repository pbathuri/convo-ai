from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "convo-ai-backend"
    debug: bool = False
    cors_origins: str = "http://localhost:3000"
    api_key: str | None = None  # optional service-to-service auth

    # LLM
    google_ai_studio_key: str | None = None
    openai_api_key: str | None = None

    # Voice
    deepgram_api_key: str | None = None
    elevenlabs_api_key: str | None = None
    sentry_dsn: str | None = None
    resend_api_key: str | None = None

    # Auth (Supabase JWT validation)
    supabase_url: str | None = None
    supabase_jwt_secret: str | None = None


settings = Settings()
