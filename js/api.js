

const API_BASE = "https://cat-weather.onrender.com";

/**
 * Fetch weather data for a given city.
 * @param {string} city
 * @returns {Promise<WeatherData>}
 *
 * WeatherData shape (matches backend schemas.py WeatherCondition):
 * {
 *   city: string,
 *   country: string,
 *   temperature_c: number,
 *   temperature_f: number,
 *   feels_like_c: number,
 *   humidity: number,
 *   description: string,
 *   wind_speed_kmh: number,
 *   ui_state: "sunny"|"cloudy"|"rainy"|"snowy"|"stormy"|"foggy"|"night",
 *   is_daytime: boolean,
 *   icon_code: string,
 *   mood_label: string
 * }
 */
export async function fetchWeather(city) {
  const url = `${API_BASE}/weather?city=${encodeURIComponent(city)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch the list of valid UI states from the backend.
 * Useful for dev tooling / a debug panel.
 */
export async function fetchUIStates() {
  const response = await fetch(`${API_BASE}/weather/states`);
  return response.json();
}
