export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LocationMeta {
  city: string;
  country: string;
  coordinates: Coordinates;
  timezone: string;
  timezoneOffset: number;
}

export interface CurrentWeather {
  dt: number;
  updatedAt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  clouds: number;
  uvi: number | null;
  description: string;
  condition: string;
  icon: string;
  iconUrl: string;
  isNight: boolean;
  units: "metric" | "imperial";
}

export interface DailyForecast {
  dt: number;
  tempMax: number;
  tempMin: number;
  pop: number;
  icon: string;
  iconUrl: string;
  condition: string;
  description: string;
  dayName: string;
  feelsLike: number | null;
  windSpeed: number | null;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  pop: number;
  icon: string;
  iconUrl: string;
  condition: string;
}

export interface WeatherBundle {
  location: LocationMeta;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}
