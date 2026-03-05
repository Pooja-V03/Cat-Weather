
const THEME_CLASSES = [
  "theme-sunny",
  "theme-cloudy",
  "theme-rainy",
  "theme-snowy",
  "theme-stormy",
  "theme-foggy",
  "theme-night",
];

// Scene elements to render per state
const SCENE_CONFIG = {
  sunny:  { element: "sun",   clouds: 0, particles: null },
  cloudy: { element: null,    clouds: 3, particles: null },
  rainy:  { element: null,    clouds: 2, particles: "rain" },
  snowy:  { element: null,    clouds: 1, particles: "snow" },
  stormy: { element: null,    clouds: 3, particles: "rain-heavy" },
  foggy:  { element: null,    clouds: 0, particles: "fog" },
  night:  { element: "moon",  clouds: 0, particles: "stars" },
};


const body          = document.body;
const particleLayer = document.getElementById("particle-layer");
const windowScene   = document.querySelector(".window-scene");
const sceneDecoEl   = document.querySelector(".scene-deco");
const windowGlass   = document.querySelector(".window-glass");


let _particleInterval = null;



/**
 * Apply all weather visuals given a WeatherData object from the backend.
 * @param {Object} data — WeatherCondition from FastAPI
 */
export function applyWeatherTheme(data) {
  const state = data.ui_state;

  _applyBodyTheme(state);
  _renderSceneElements(state);
  _startParticles(state);
  _updateGlassEffect(state);
}

/**
 * Remove all weather effects (call before loading a new city).
 */
export function clearWeatherEffects() {
  clearInterval(_particleInterval);
  _particleInterval = null;
  particleLayer.innerHTML = "";
}



function _applyBodyTheme(state) {
  // Remove all theme classes then add the correct one
  body.classList.remove(...THEME_CLASSES);
  body.classList.add(`theme-${state}`);
}

function _renderSceneElements(state) {
  // Clear previous scene elements
  const existing = windowScene.querySelectorAll(".scene-element, .cloud-puff, .fog-layer");
  existing.forEach(el => el.remove());

  const cfg = SCENE_CONFIG[state] || {};

  // Sun / Moon
  if (cfg.element) {
    const el = document.createElement("div");
    el.className = `scene-element ${cfg.element}`;
    windowScene.appendChild(el);
  }

  // Pixel clouds
  for (let i = 0; i < (cfg.clouds || 0); i++) {
    _createCloud(i);
  }

  // Fog layers
  if (state === "foggy") {
    [20, 50, 80].forEach((topPct, idx) => {
      const fog = document.createElement("div");
      fog.className = "fog-layer";
      fog.style.top = `${topPct}%`;
      fog.style.animationDuration = `${8 + idx * 3}s`;
      fog.style.opacity = "0.5";
      windowScene.appendChild(fog);
    });
  }
}

function _createCloud(index) {
  const positions = [
    { top: 18, left: 10, w: 80, h: 36, delay: "0s" },
    { top: 30, left: 55, w: 60, h: 28, delay: "2s" },
    { top: 10, left: 35, w: 50, h: 24, delay: "1s" },
  ];
  const pos = positions[index % positions.length];

  // Make a fluffy cloud from 3 overlapping circles
  const cloud = document.createElement("div");
  cloud.className = "scene-element";
  cloud.style.cssText = `
    top: ${pos.top}%; left: ${pos.left}%;
    width: ${pos.w}px; height: ${pos.h}px;
    animation-delay: ${pos.delay};
    animation-duration: ${7 + index * 2}s;
  `;

  const puffs = [
    { w: 0.55, h: 0.9, left: "0%" },
    { w: 0.70, h: 1.0, left: "25%" },
    { w: 0.55, h: 0.85, left: "50%" },
  ];
  puffs.forEach(p => {
    const puff = document.createElement("div");
    puff.className = "cloud-puff";
    puff.style.cssText = `
      width: ${pos.w * p.w}px;
      height: ${pos.h * p.h}px;
      left: ${p.left};
      bottom: 0;
    `;
    cloud.appendChild(puff);
  });

  windowScene.appendChild(cloud);
}

function _startParticles(state) {
  clearInterval(_particleInterval);
  particleLayer.innerHTML = "";

  if (!state) return;

  const cfg = SCENE_CONFIG[state];
  if (!cfg?.particles) return;

  const creators = {
    "rain":       () => _spawnRaindrop(6, 20),
    "rain-heavy": () => _spawnRaindrop(3, 32),
    "snow":       () => _spawnSnowflake(),
    "stars":      _spawnStars,   // one-shot
    "fog":        null,          // fog uses CSS layers, not particles
  };

  const creator = creators[cfg.particles];
  if (!creator) return;

  if (cfg.particles === "stars") {
    _spawnStars();
    return;
  }

  // Kick off with some initial particles
  for (let i = 0; i < 8; i++) setTimeout(creator, i * 200);
  _particleInterval = setInterval(creator, cfg.particles.startsWith("rain") ? 180 : 600);
}

function _spawnRaindrop(minDur, maxCount) {
  const existing = particleLayer.querySelectorAll(".raindrop");
  if (existing.length > maxCount) return;

  const drop = document.createElement("div");
  drop.className = "raindrop";
  drop.style.left   = `${Math.random() * 100}%`;
  drop.style.height = `${10 + Math.random() * 16}px`;
  drop.style.animationDuration = `${minDur * 0.6 + Math.random() * minDur * 0.8}s`;
  drop.style.animationDelay = `${Math.random() * -2}s`;
  drop.style.opacity = String(0.5 + Math.random() * 0.5);
  particleLayer.appendChild(drop);

  drop.addEventListener("animationiteration", () => {
    drop.style.left = `${Math.random() * 100}%`;
  }, { once: false });
}

function _spawnSnowflake() {
  const existing = particleLayer.querySelectorAll(".snowflake");
  if (existing.length > 30) return;

  const flake = document.createElement("div");
  flake.className = "snowflake";
  const size = 3 + Math.random() * 5;
  flake.style.left   = `${Math.random() * 100}%`;
  flake.style.width  = `${size}px`;
  flake.style.height = `${size}px`;
  flake.style.animationDuration = `${6 + Math.random() * 8}s`;
  flake.style.animationDelay = `${Math.random() * -6}s`;
  particleLayer.appendChild(flake);
}

function _spawnStars() {
  for (let i = 0; i < 40; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = 1 + Math.random() * 3;
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 60}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${1.5 + Math.random() * 2.5}s;
      animation-delay: ${Math.random() * -3}s;
    `;
    particleLayer.appendChild(star);
  }
}

function _updateGlassEffect(state) {
  // Remove all weather classes from glass overlay
  windowGlass.className = `window-glass ${state}`;
}
