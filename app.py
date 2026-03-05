from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

API_KEY = "afd33fbd7fb39595a50b20b95618d14b"

@app.route("/weather")
def get_weather():
    city = request.args.get("city", "Tokyo")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    
    r = requests.get(url)
    if r.status_code != 200:
        return jsonify({"error": "City not found"}), 404
    
    data = r.json()
    weather_id = data["weather"][0]["id"]
    icon = data["weather"][0]["icon"]
    is_day = icon.endswith("d")
    
    if weather_id < 300:
        ui_state = "stormy"
    elif weather_id < 600:
        ui_state = "rainy"
    elif weather_id < 700:
        ui_state = "snowy"
    elif weather_id < 800:
        ui_state = "foggy"
    elif weather_id == 800:
        ui_state = "sunny" if is_day else "night"
    else:
        ui_state = "cloudy"

    moods = {
        "sunny": "Sunny & Bright ☀️",
        "cloudy": "Soft & Cloudy ☁️",
        "rainy": "Rainy Day 🌧️",
        "snowy": "Let it Snow ❄️",
        "stormy": "Stormy Weather ⛈️",
        "foggy": "Misty Morning 🌫️",
        "night": "Starry Night 🌙",
    }

    temp_c = round(data["main"]["temp"], 1)

    return jsonify({
        "city": data["name"],
        "country": data["sys"]["country"],
        "temperature_c": temp_c,
        "temperature_f": round(temp_c * 9/5 + 32, 1),
        "feels_like_c": round(data["main"]["feels_like"], 1),
        "humidity": data["main"]["humidity"],
        "description": data["weather"][0]["description"].title(),
        "wind_speed_kmh": round(data["wind"].get("speed", 0) * 3.6, 1),
        "ui_state": ui_state,
        "is_daytime": is_day,
        "icon_code": icon,
        "mood_label": moods.get(ui_state, "A Lovely Day 🌈")
    })

if __name__ == "__main__":
    app.run(port=8000, debug=False)