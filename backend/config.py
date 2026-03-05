import os
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "YOUR_API_KEY_HERE")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

# Default city if none specified
DEFAULT_CITY = os.getenv("DEFAULT_CITY", "India")


ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "null",  
]
