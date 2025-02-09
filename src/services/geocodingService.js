import axios from "axios";
import { API_KEY, GEOCODING_BASE_URL } from "../constants/api.js";

const client = axios.create({
  baseURL: GEOCODING_BASE_URL,
  timeout: 8000,
});

const withKey = (params = {}) => ({
  ...params,
  appid: API_KEY,
});

export async function geocodeCity(city, limit = 1) {
  const { data } = await client.get("/direct", {
    params: withKey({ q: city, limit }),
  });

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("City could not be found.");
  }

  const result = data[0];
  return {
    name: result.name,
    country: result.country,
    state: result.state ?? "",
    lat: result.lat,
    lon: result.lon,
  };
}

export async function reverseGeocode(lat, lon, limit = 1) {
  const { data } = await client.get("/reverse", {
    params: withKey({ lat, lon, limit }),
  });

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const result = data[0];
  return {
    name: result.name,
    country: result.country,
    state: result.state ?? "",
    lat: result.lat,
    lon: result.lon,
  };
}
