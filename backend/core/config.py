from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # LLM providers
    GOOGLE_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None

    # Database & auth
    MONGO_URI: str
    DB_NAME: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"

    #Cloudinary
    CLOUDINARY_CLOUD_NAME : str
    CLOUDINARY_API_KEY : str
    CLOUDINARY_API_SECRET : str

    ENV: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="forbid"
    )


settings = Settings()