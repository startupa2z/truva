from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://truva:truva@localhost:5432/truva"
    secret_key: str = "dev-secret-change-in-production"
    frontend_url: str = "http://localhost:8888"
    linkedin_client_id: str = ""
    linkedin_client_secret: str = ""
    linkedin_redirect_uri: str = "http://localhost:8000/api/auth/linkedin/callback"
    access_token_expire_minutes: int = 60 * 24 * 7

    linkedin_authorize_url: str = "https://www.linkedin.com/oauth/v2/authorization"
    linkedin_token_url: str = "https://www.linkedin.com/oauth/v2/accessToken"
    linkedin_userinfo_url: str = "https://api.linkedin.com/v2/userinfo"


settings = Settings()
