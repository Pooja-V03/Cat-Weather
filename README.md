# 🐱 Cat & Weather

A cozy pixel-art weather widget where your local forecast meets a very opinionated cat.

🌐 **Live Demo → [LINK](https://cat-weather-app-five.vercel.app/)**

---

## What it does

Search any city and watch the scene transform — sunny skies, stormy nights, soft snowfall — while your cat reacts with her own thoughts about the weather. Click her for a surprise. 🐾

## Features

- Real-time weather via OpenWeatherMap API
- 7 dynamic themes — Sunny, Cloudy, Rainy, Snowy, Stormy, Foggy, Night
- Animated rain, snow, stars and fog particles
- Reactive pixel-art cat with mood-matching colours
- Temperature in °C and °F, humidity, wind speed
- Fully responsive

## Tech Stack

- Frontend — Vanilla HTML, CSS, JavaScript
- Backend — FastAPI + httpx
- Weather data — OpenWeatherMap API
- Frontend deployed on Vercel
- Backend deployed on Render

## Project Structure

```
Cat-Weather/
├── index.html
├── js/
│   ├── api.js
│   ├── weather-controller.js
│   └── cat-controller.js
├── css/
│   ├── base.css
│   ├── window.css
│   ├── cat.css
│   └── weather-themes.css
└── backend/
    ├── app.py
    ├── weather_service.py
    ├── schemas.py
    ├── config.py
    └── requirements.txt
```

## Run Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app:app --port 8000 --reload

# Frontend
# Open index.html with Live Server or any static file server
```

Create a `.env` file in `/backend`:
```
OPENWEATHER_API_KEY=your_api_key_here
```

> Free API key at [openweathermap.org](https://openweathermap.org/api)

---

*Made with 🐾 and too much attention to pixel-perfect detail.*
