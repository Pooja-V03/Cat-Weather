from pydantic import BaseModel
from typing import Optional

class WeatherCondition(BaseModel):
    city: str
    country: str
    temperature_c: float
    temperature_f: float
    feels_like_c: float
    humidity: int
    description: str
    wind_speed_kmh: float
    ui_state: str
    is_daytime: bool
    icon_code: str
    mood_label: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None