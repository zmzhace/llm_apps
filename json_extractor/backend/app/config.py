from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_KEY: str
    API_URL: str
    MODEL_NAME: str = "glm-4"
    
    class Config:
        env_file = ".env"

settings = Settings() 