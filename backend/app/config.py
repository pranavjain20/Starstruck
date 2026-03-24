from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    gemini_api_key: str = ""
    google_maps_api_key: str = ""
    github_token: str = ""
    cors_origins: list[str] = ["http://localhost:5173", "https://starstruck-eta.vercel.app"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
