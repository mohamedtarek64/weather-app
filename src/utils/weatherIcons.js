import { ICON_BASE_URL } from "../constants/api.js";

const CONDITION_MAP = [
  { codes: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232], slug: "thunder" },
  { codes: [300, 301, 302, 310, 311, 312, 313, 314, 321], slug: "drizzle" },
  { codes: [500, 501, 502, 503, 504], slug: "rain" },
  { codes: [511, 520, 521, 522, 531], slug: "shower" },
  { codes: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622], slug: "snow" },
  { codes: [701, 711, 721, 731, 741, 751, 761, 762], slug: "mist" },
  { codes: [771, 781], slug: "extreme" },
  { codes: [800], slug: "clear" },
  { codes: [801, 802], slug: "cloudy" },
  { codes: [803, 804], slug: "overcast" },
];

const EMOJI_MAP = {
  thunder: "⛈️",
  drizzle: "🌦️",
  rain: "🌧️",
  shower: "🌦️",
  snow: "🌨️",
  mist: "🌫️",
  extreme: "🌪️",
  clear: "☀️",
  cloudy: "⛅",
  overcast: "☁️",
};

const ICON_NAME_MAP = {
  clear: "day-clear",
  "night-clear": "night-clear",
  partly: "day-partly",
  "night-cloudy": "night-partly",
  cloudy: "cloudy",
  overcast: "overcast",
  rain: "rain",
  "night-rain": "rain",
  drizzle: "drizzle",
  shower: "shower",
  thunder: "thunder",
  "night-thunder": "thunder",
  snow: "snow",
  "night-snow": "snow",
  mist: "mist",
  "night-mist": "mist",
  extreme: "extreme",
  "night-extreme": "extreme",
};

const findConditionByCode = (code) => {
  const entry = CONDITION_MAP.find((item) => item.codes.includes(Number(code)));
  return entry?.slug ?? "clear";
};

export const getWeatherEmoji = (codeOrCondition) => {
  const condition =
    typeof codeOrCondition === "string"
      ? codeOrCondition
      : findConditionByCode(codeOrCondition);
  return EMOJI_MAP[condition] ?? "☀️";
};

export const getWeatherIcon = (iconCode, size = "4x") =>
  iconCode ? `${ICON_BASE_URL}${iconCode}@${size}.png` : "";

export const resolveCondition = (code, iconCode = "") => {
  const slug = findConditionByCode(code);
  return iconCode.includes("n") ? `night-${slug}` : slug;
};

export const getWeatherIconName = (codeOrCondition) => {
  const condition =
    typeof codeOrCondition === "string"
      ? codeOrCondition
      : resolveCondition(codeOrCondition);
  return ICON_NAME_MAP[condition] ?? ICON_NAME_MAP.clear;
};
