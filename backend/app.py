from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from weather_service import fetch_weather
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/weather")
async def get_weather(city: str = "Tokyo"):
    try:
        data = await fetch_weather(city)
        return data
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=404, detail="City not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
