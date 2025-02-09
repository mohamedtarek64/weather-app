export const celsiusToFahrenheit = (temp) => (temp * 9) / 5 + 32;

export const fahrenheitToCelsius = (temp) => ((temp - 32) * 5) / 9;

export const formatTemp = (temp, unit = "metric") => {
  if (temp === null || temp === undefined || Number.isNaN(temp)) {
    return "--";
  }
  const rounded = Math.round(temp);
  return unit === "imperial" ? `${rounded}°F` : `${rounded}°C`;
};

export const convertTemp = (temp, unit) =>
  unit === "imperial" ? celsiusToFahrenheit(temp) : temp;
