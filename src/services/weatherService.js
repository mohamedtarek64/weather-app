import axios from "axios";
import {
  API_KEY,
  BASE_URL,
  ICON_BASE_URL,
  HOURLY_LIMIT,
  DAILY_LIMIT,
  ONE_CALL_BASE_URL,
} from "../constants/api.js";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const oneCallClient = axios.create({
  baseURL: ONE_CALL_BASE_URL,
  timeout: 10000,
});

const oneCallUnauthorizedMessage =
  "Access to One Call API failed (401). Check your subscription.";

const withKey = (params = {}) => ({
  ...params,
  appid: API_KEY,
});

const resolveIconUrl = (code, size = "4x") =>
  code ? `${ICON_BASE_URL}${code}@${size}.png` : "";

const mapCondition = (code = 800, icon = "") => {
  const night = icon.includes("n");
  if (code >= 200 && code < 300) return night ? "night-thunder" : "thunder";
  if (code >= 300 && code < 600) return night ? "night-rain" : "rain";
  if (code >= 600 && code < 700) return night ? "night-snow" : "snow";
  if (code >= 700 && code < 800) return night ? "night-mist" : "mist";
  if (code === 800) return night ? "night-clear" : "clear";
  if (code === 801 || code === 802) return night ? "night-cloudy" : "partly";
  return night ? "night-cloudy" : "cloudy";
};

const pickDaily = (daily = []) =>
  daily.slice(1, DAILY_LIMIT).map((day) => {
    const weather = day.weather?.[0] ?? {};
    const conditionSlug = mapCondition(weather.id, weather.icon ?? "");

    return {
      dt: day.dt * 1000,
      sunrise: day.sunrise * 1000,
      sunset: day.sunset * 1000,
      tempMax: day.temp.max,
      tempMin: day.temp.min,
      pop: Math.round((day.pop ?? 0) * 100),
      icon: weather.icon ?? "",
      iconUrl: resolveIconUrl(weather.icon),
      condition: conditionSlug,
      description: weather.description ?? "",
      feelsLike: day.feels_like?.day ?? null,
      windSpeed: day.wind_speed ?? null,
    };
  });

const pickHourly = (hourly = []) =>
  hourly.slice(0, HOURLY_LIMIT).map((hour) => {
    const weather = hour.weather?.[0] ?? {};
    const conditionSlug = mapCondition(weather.id, weather.icon ?? "");

    return {
      dt: hour.dt * 1000,
      temp: hour.temp,
      pop: Math.round((hour.pop ?? 0) * 100),
      icon: weather.icon ?? "",
      iconUrl: resolveIconUrl(weather.icon),
      condition: conditionSlug,
    };
  });

const transformBundle = (currentPayload, oneCallPayload, units) => {
  const currentWeather = currentPayload.weather?.[0] ?? {};
  const icon = currentWeather.icon ?? "";
  const condition = mapCondition(currentWeather.id, icon);
  const { current, timezone, timezone_offset: offset } = oneCallPayload;

  return {
    location: {
      city: currentPayload.name,
      country: currentPayload.sys?.country ?? "",
      coordinates: {
        lat: currentPayload.coord?.lat ?? 0,
        lon: currentPayload.coord?.lon ?? 0,
      },
      timezone,
      timezoneOffset: offset,
    },
    current: {
      updatedAt: Date.now(),
      dt: (currentPayload.dt ?? current.dt) * 1000,
      sunrise: (currentPayload.sys?.sunrise ?? current.sunrise) * 1000,
      sunset: (currentPayload.sys?.sunset ?? current.sunset) * 1000,
      temp: currentPayload.main?.temp ?? current.temp,
      feelsLike: currentPayload.main?.feels_like ?? current.feels_like,
      humidity: currentPayload.main?.humidity ?? current.humidity,
      pressure: currentPayload.main?.pressure ?? current.pressure,
      visibility: currentPayload.visibility ?? current.visibility ?? 0,
      windSpeed: currentPayload.wind?.speed ?? current.wind_speed,
      windDeg: currentPayload.wind?.deg ?? current.wind_deg,
      clouds: currentPayload.clouds?.all ?? current.clouds,
      uvi: current?.uvi ?? null,
      description: currentWeather.description ?? "",
      condition,
      icon,
      iconUrl: resolveIconUrl(icon),
      isNight: icon.includes("n"),
      units,
    },
    hourly: pickHourly(oneCallPayload.hourly),
    daily: pickDaily(oneCallPayload.daily),
  };
};

const fetchOneCall = async (lat, lon, units) => {
  try {
    const { data } = await oneCallClient.get("/onecall", {
      params: withKey({
        lat,
        lon,
        units,
        exclude: "minutely,alerts",
      }),
    });
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message ?? oneCallUnauthorizedMessage;
      const err = new Error(message);
      err.code = 401;
      throw err;
    }
    throw error;
  }
};

const fetchForecastSeries = async (lat, lon, units) => {
  const { data } = await client.get("/forecast", {
    params: withKey({
      lat,
      lon,
      units,
    }),
  });
  return data;
};

const buildHourlyFromSeries = (series = []) =>
  series.slice(0, HOURLY_LIMIT).map((entry) => {
    const weather = entry.weather?.[0] ?? {};
    const conditionSlug = mapCondition(weather.id, weather.icon ?? "");

    return {
      dt: entry.dt * 1000,
      temp: entry.main?.temp ?? null,
      pop: Math.round((entry.pop ?? 0) * 100),
      icon: weather.icon ?? "",
      iconUrl: resolveIconUrl(weather.icon ?? ""),
      condition: conditionSlug,
    };
  });

const groupByDay = (series = []) =>
  series.reduce((acc, entry) => {
    const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
    acc[date] = acc[date] ?? [];
    acc[date].push(entry);
    return acc;
  }, {});

const pickDailyFromSeries = (series = [], timezoneOffset = 0) => {
  const grouped = groupByDay(series);
  const days = Object.keys(grouped)
    .sort()
    .slice(1, DAILY_LIMIT + 1); // skip current day

  return days.map((dateKey) => {
    const entries = grouped[dateKey];
    const temps = entries.map((entry) => entry.main ?? {});
    const weatherSample =
      entries.find((entry) => {
        const hour = new Date(entry.dt * 1000 + timezoneOffset * 1000).getUTCHours();
        return hour >= 11 && hour <= 15;
      }) ?? entries[Math.floor(entries.length / 2)];

    const pop = Math.max(
      ...entries.map((entry) => Math.round((entry.pop ?? 0) * 100)),
      0
    );

    const weather = weatherSample?.weather?.[0] ?? {};
    const conditionSlug = mapCondition(weather.id, weather.icon ?? "");

    return {
      dt: entries[0].dt * 1000,
      sunrise: null,
      sunset: null,
      tempMax: Math.max(...temps.map((temp) => temp.temp_max ?? -Infinity)),
      tempMin: Math.min(...temps.map((temp) => temp.temp_min ?? Infinity)),
      pop,
      icon: weather.icon ?? "",
      iconUrl: resolveIconUrl(weather.icon ?? ""),
      condition: conditionSlug,
      description: weather.description ?? "",
      feelsLike: null,
      windSpeed: weatherSample?.wind?.speed ?? null,
    };
  });
};

const transformBundleFromForecast = (currentPayload, forecastPayload, units) => {
  const currentWeather = currentPayload.weather?.[0] ?? {};
  const icon = currentWeather.icon ?? "";
  const condition = mapCondition(currentWeather.id, icon);
  const timezone = forecastPayload.city?.timezone ?? 0;

  const hourly = buildHourlyFromSeries(forecastPayload.list ?? []);
  const daily = pickDailyFromSeries(forecastPayload.list ?? [], timezone);

  return {
    location: {
      city: currentPayload.name,
      country: currentPayload.sys?.country ?? "",
      coordinates: {
        lat: currentPayload.coord?.lat ?? 0,
        lon: currentPayload.coord?.lon ?? 0,
      },
      timezone,
      timezoneOffset: timezone,
    },
    current: {
      updatedAt: Date.now(),
      dt: (currentPayload.dt ?? Date.now() / 1000) * 1000,
      sunrise: (currentPayload.sys?.sunrise ?? forecastPayload.city?.sunrise ?? 0) * 1000,
      sunset: (currentPayload.sys?.sunset ?? forecastPayload.city?.sunset ?? 0) * 1000,
      temp: currentPayload.main?.temp ?? null,
      feelsLike: currentPayload.main?.feels_like ?? null,
      humidity: currentPayload.main?.humidity ?? null,
      pressure: currentPayload.main?.pressure ?? null,
      visibility: currentPayload.visibility ?? 0,
      windSpeed: currentPayload.wind?.speed ?? null,
      windDeg: currentPayload.wind?.deg ?? null,
      clouds: currentPayload.clouds?.all ?? null,
      uvi: null,
      description: currentWeather.description ?? "",
      condition,
      icon,
      iconUrl: resolveIconUrl(icon),
      isNight: icon.includes("n"),
      units,
    },
    hourly,
    daily,
  };
};

export async function getCurrentWeather(city, units = "metric") {
  const { data } = await client.get("/weather", {
    params: withKey({ q: city, units }),
  });
  const { lat, lon } = data.coord;
  try {
    const oneCall = await fetchOneCall(lat, lon, units);
    return transformBundle(data, oneCall, units);
  } catch (error) {
    if (error.code === 401 || error.response?.status === 401) {
      const forecast = await fetchForecastSeries(lat, lon, units);
      return transformBundleFromForecast(data, forecast, units);
    }
    throw error;
  }
}

export async function getWeatherByCoords(lat, lon, units = "metric") {
  const { data } = await client.get("/weather", {
    params: withKey({ lat, lon, units }),
  });
  try {
    const oneCall = await fetchOneCall(lat, lon, units);
    return transformBundle(data, oneCall, units);
  } catch (error) {
    if (error.code === 401 || error.response?.status === 401) {
      const forecast = await fetchForecastSeries(lat, lon, units);
      return transformBundleFromForecast(data, forecast, units);
    }
    throw error;
  }
}

export async function getForecast(city, units = "metric") {
  const bundle = await getCurrentWeather(city, units);
  return bundle.daily;
}

export { resolveIconUrl };
