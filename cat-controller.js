

const CAT_THOUGHTS = {
  sunny:  ["basking...", "so warm ☀️", "nap time zzz", "birds! 👀"],
  cloudy: ["hmm... grey", "cozy vibes", "play time? 🧶", "zzzz..."],
  rainy:  ["stay inside", "pitter patter", "no thanks 🌧️", "dry paws ✅"],
  snowy:  ["brrr!! ❄️", "cold cold cold", "snowball? 🤔", "fireplace pls"],
  stormy: ["!!!", "too loud 😾", "hiding now", "thunder bad"],
  foggy:  ["can't see...", "spooky 👻", "where am i?", "mystery vibes"],
  night:  ["moon watching", "still awake", "who's there? 🌙", "good night ✨"],
};


const catSprite    = document.querySelector(".cat-sprite");
const thoughtBubble = document.querySelector(".thought-bubble");
const catContainer  = document.querySelector(".cat-container");


const ALL_STATES = ["sunny", "cloudy", "rainy", "snowy", "stormy", "foggy", "night"];
let _thoughtIndex = 0;
let _thoughtInterval = null;



/**
 * Update the cat to reflect a new weather state.
 * @param {Object} data — WeatherCondition from FastAPI
 */
export function applyCatState(data) {
  const state = data.ui_state;

  _setAnimationState(state);
  _rotateCatThoughts(state);
  _setCatColours(state, data);
}



function _setAnimationState(state) {
  // Remove any existing state class
  ALL_STATES.forEach(s => catSprite.classList.remove(`state-${s}`));
  catSprite.classList.add(`state-${state}`);
}

function _rotateCatThoughts(state) {
  clearInterval(_thoughtInterval);
  _thoughtIndex = 0;

  const thoughts = CAT_THOUGHTS[state] || ["mrrrow..."];

  const updateThought = () => {
    thoughtBubble.textContent = thoughts[_thoughtIndex % thoughts.length];
    _thoughtIndex++;
  };

  updateThought();                          // show immediately
  _thoughtInterval = setInterval(updateThought, 3500);
}

function _setCatColours(state, data) {
  // Night mode: desaturated silver-grey cat
  // Stormy:scared cat
  // Other states: handled by CSS theme variables in weather-themes.css

  const root = document.documentElement;

  if (state === "night") {
    root.style.setProperty("--cat-eye", "#c8a8e8"); // glowing purple eyes at night
  } else if (state === "stormy") {
    root.style.setProperty("--cat-eye", "#3d2b4a");
    catSprite.style.filter = "saturate(0.7) brightness(0.9)";
  } else {
    root.style.removeProperty("--cat-eye");
    catSprite.style.filter = "";
  }
}


catContainer.addEventListener("click", () => {
  const reactions = ["purrrr 💜", "nyaa~", "head pat!", "🐾", "mrow!"];
  const original = thoughtBubble.textContent;

  thoughtBubble.textContent = reactions[Math.floor(Math.random() * reactions.length)];

  // Bounce
  catSprite.style.transition = "transform 0.15s";
  catSprite.style.transform = "scale(1.1)";
  setTimeout(() => { catSprite.style.transform = ""; }, 150);

  // Restore thought
  setTimeout(() => { thoughtBubble.textContent = original; }, 2000);
});
