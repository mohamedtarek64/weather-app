export const API_KEY = import.meta.env.VITE_WEATHER_API_KEY ?? "";
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://api.openweathermap.org/data/2.5";
export const GEOCODING_BASE_URL =
  import.meta.env.VITE_GEOCODING_BASE_URL ?? "https://api.openweathermap.org/geo/1.0";
export const ICON_BASE_URL =
  import.meta.env.VITE_ICON_BASE_URL ?? "https://openweathermap.org/img/wn/";
export const ONE_CALL_BASE_URL =
  import.meta.env.VITE_ONE_CALL_BASE_URL ?? "https://api.openweathermap.org/data/3.0";

export const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
export const HOURLY_LIMIT = 24;
export const DAILY_LIMIT = 6;
