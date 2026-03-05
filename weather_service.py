import httpx
from config import OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL
from schemas import WeatherCondition



def _map_condition_id_to_ui_state(weather_id: int, is_daytime: bool) -> str:
    if weather_id < 300:
        return "stormy"
    elif weather_id < 600:
        return "rainy"
    elif weather_id < 700:
        return "snowy"
    elif weather_id < 800:
        return "foggy"
    elif weather_id == 800:
        return "sunny" if is_daytime else "night"
    else:
        return "cloudy"


# Mood labels — friendly copy shown in the widget
_MOOD_LABELS = {
    "sunny":  "Sunny & Bright ☀️",
    "cloudy": "Soft & Cloudy ☁️",
    "rainy":  "Rainy Day 🌧️",
    "snowy":  "Let it Snow ❄️",
    "stormy": "Stormy Weather ⛈️",
    "foggy":  "Misty Morning 🌫️",
    "night":  "Starry Night 🌙",
}


async def fetch_weather(city: str) -> WeatherCondition:
    
    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",   # always store Celsius; we convert to F here
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(OPENWEATHER_BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

    weather_id = data["weather"][0]["id"]
    icon_code  = data["weather"][0]["icon"]
    is_daytime = icon_code.endswith("d")

    temp_c      = round(data["main"]["temp"], 1)
    temp_f      = round(temp_c * 9 / 5 + 32, 1)
    feels_like  = round(data["main"]["feels_like"], 1)
    wind_ms     = data["wind"].get("speed", 0)
    wind_kmh    = round(wind_ms * 3.6, 1)

    ui_state    = _map_condition_id_to_ui_state(weather_id, is_daytime)

    return WeatherCondition(
        city=data["name"],
        country=data["sys"]["country"],
        temperature_c=temp_c,
        temperature_f=temp_f,
        feels_like_c=feels_like,
        humidity=data["main"]["humidity"],
        description=data["weather"][0]["description"].title(),
        wind_speed_kmh=wind_kmh,
        ui_state=ui_state,
        is_daytime=is_daytime,
        icon_code=icon_code,
        mood_label=_MOOD_LABELS.get(ui_state, "A Lovely Day 🌈"),
    )
