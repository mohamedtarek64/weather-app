import { ref, computed } from "vue";
import { getCurrentWeather, getWeatherByCoords } from "../services/weatherService.js";
import { reverseGeocode } from "../services/geocodingService.js";
import { useLocalStorage } from "./useLocalStorage.js";
import { CACHE_TTL } from "../constants/api.js";
import { formatTemp } from "../utils/temperatureConverter.js";

const cache = new Map();

const cacheKey = (type, value, units) => `${type}:${value}:${units}`.toLowerCase();

const setCache = (key, payload) => {
  cache.set(key, {
    payload,
    timestamp: Date.now(),
  });
};

const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.payload;
};

const normalizeCity = (city) => city.trim().replace(/\s+/g, " ");

const INITIAL_HISTORY = () => [];

export function useWeather() {
  const current = ref(null);
  const meta = ref(null);
  const daily = ref([]);
  const hourly = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const units = ref("metric");
  const recentSearches = ref(INITIAL_HISTORY());
  const lastRequest = ref(null);

  const lastCityStorage = useLocalStorage("weather:last-city");
  const historyStorage = useLocalStorage("weather:recent-cities");

  recentSearches.value = historyStorage.get(INITIAL_HISTORY()) ?? [];

  const isNight = computed(() => {
    if (!current.value) return false;
    const now = current.value.dt;
    return now < current.value.sunrise || now > current.value.sunset;
  });

  const weatherCondition = computed(() => current.value?.condition ?? "clear");

  const backgroundTheme = computed(() => {
    const condition = weatherCondition.value;
    return `theme-${condition}`;
  });

  const formattedTemperature = computed(() => {
    if (!current.value) return "--";
    return formatTemp(current.value.temp, units.value);
  });

  const applyPayload = (payload) => {
    current.value = payload.current;
    meta.value = payload.location;
    daily.value = payload.daily;
    hourly.value = payload.hourly;
    error.value = null;
  };

  const pushHistory = (label) => {
    if (!label) return;
    const normalized = label.trim();
    if (!normalized) return;

    const updated = [
      normalized,
      ...recentSearches.value.filter(
        (entry) => entry.toLowerCase() !== normalized.toLowerCase()
      ),
    ].slice(0, 5);

    recentSearches.value = updated;
    historyStorage.save(updated);
  };

  const fetchWeatherByCity = async (city, { persist = true } = {}) => {
    const normalized = normalizeCity(city);
    if (!normalized) {
      error.value = new Error("Please enter a valid city name.");
      return;
    }

    loading.value = true;
    error.value = null;

    const key = cacheKey("city", normalized, units.value);
    try {
      const cached = getCache(key);
      if (cached) {
        applyPayload(cached);
      } else {
        const weather = await getCurrentWeather(normalized, units.value);
        applyPayload(weather);
        setCache(key, weather);
      }

      lastRequest.value = { type: "city", value: normalized };

      if (persist) {
        lastCityStorage.save(normalized);
        pushHistory(meta.value?.city ?? normalized);
      }
    } catch (err) {
      error.value = normalizeError(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchWeatherByCoords = async (lat, lon, { persist = true } = {}) => {
    loading.value = true;
    error.value = null;

    const roundedLat = Number(lat).toFixed(3);
    const roundedLon = Number(lon).toFixed(3);
    const key = cacheKey("coords", `${roundedLat},${roundedLon}`, units.value);

    try {
      const cached = getCache(key);
      if (cached) {
        applyPayload(cached);
      } else {
        const weather = await getWeatherByCoords(lat, lon, units.value);
        applyPayload(weather);
        setCache(key, weather);
      }

      lastRequest.value = {
        type: "coords",
        value: { lat, lon },
      };

      if (persist) {
        let label = meta.value?.city ?? "";
        try {
          const reverse = await reverseGeocode(lat, lon);
          if (reverse?.name) {
            label = reverse.name;
          }
        } catch (reverseError) {
          console.warn("[useWeather] reverse geocode failed", reverseError);
        }
        if (label) {
          lastCityStorage.save(label);
          pushHistory(label);
        }
      }
    } catch (err) {
      error.value = normalizeError(err);
    } finally {
      loading.value = false;
    }
  };

  const toggleUnits = async () => {
    units.value = units.value === "metric" ? "imperial" : "metric";
    cache.clear();
    if (lastRequest.value) {
      await refreshWeather();
    }
  };

  const refreshWeather = async () => {
    if (!lastRequest.value) {
      const lastCity = lastCityStorage.get("");
      if (lastCity) {
        await fetchWeatherByCity(lastCity, { persist: false });
      }
      return;
    }

    if (lastRequest.value.type === "city") {
      await fetchWeatherByCity(lastRequest.value.value, { persist: false });
      return;
    }

    if (lastRequest.value.type === "coords") {
      const { lat, lon } = lastRequest.value.value;
      await fetchWeatherByCoords(lat, lon, { persist: false });
    }
  };

  const fetchForecast = async (city) => {
    await fetchWeatherByCity(city);
    return daily.value;
  };

  return {
    current,
    meta,
    daily,
    hourly,
    loading,
    error,
    units,
    isNight,
    backgroundTheme,
    weatherCondition,
    formattedTemperature,
    recentSearches,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    fetchForecast,
    toggleUnits,
    refreshWeather,
  };
}

const normalizeError = (err) => {
  if (!err) return new Error("Something unexpected happened.");
  if (err.response?.status === 404) {
    return new Error("We couldn't find that city.");
  }
  if (err.response?.status === 401) {
    return new Error("Please double-check your API key.");
  }
  if (err.message === "Network Error") {
    return new Error("Check your internet connection.");
  }
  return err instanceof Error
    ? err
    : new Error("We couldn't fetch the weather data right now.");
};
