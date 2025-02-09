import dayClearSvg from "../../assets/images/weather-icons/day-clear.svg?raw";
import nightClearSvg from "../../assets/images/weather-icons/night-clear.svg?raw";
import dayPartlySvg from "../../assets/images/weather-icons/day-partly.svg?raw";
import nightPartlySvg from "../../assets/images/weather-icons/night-partly.svg?raw";
import cloudySvg from "../../assets/images/weather-icons/cloudy.svg?raw";
import overcastSvg from "../../assets/images/weather-icons/overcast.svg?raw";
import rainSvg from "../../assets/images/weather-icons/rain.svg?raw";
import drizzleSvg from "../../assets/images/weather-icons/drizzle.svg?raw";
import showerSvg from "../../assets/images/weather-icons/shower.svg?raw";
import thunderSvg from "../../assets/images/weather-icons/thunder.svg?raw";
import snowSvg from "../../assets/images/weather-icons/snow.svg?raw";
import mistSvg from "../../assets/images/weather-icons/mist.svg?raw";
import extremeSvg from "../../assets/images/weather-icons/extreme.svg?raw";

const extractDefinition = (svgContent) => {
  if (!svgContent) {
    return { body: "", viewBox: "0 0 24 24" };
  }

  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const body = svgContent.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

  return {
    body: body.trim(),
    viewBox: viewBoxMatch?.[1] ?? "0 0 24 24",
  };
};

export const weatherIcons = {
  "day-clear": extractDefinition(dayClearSvg),
  "night-clear": extractDefinition(nightClearSvg),
  "day-partly": extractDefinition(dayPartlySvg),
  "night-partly": extractDefinition(nightPartlySvg),
  cloudy: extractDefinition(cloudySvg),
  overcast: extractDefinition(overcastSvg),
  rain: extractDefinition(rainSvg),
  drizzle: extractDefinition(drizzleSvg),
  shower: extractDefinition(showerSvg),
  thunder: extractDefinition(thunderSvg),
  snow: extractDefinition(snowSvg),
  mist: extractDefinition(mistSvg),
  extreme: extractDefinition(extremeSvg),
};

export const getWeatherIconDefinition = (name) =>
  weatherIcons[name] ?? weatherIcons["day-clear"];
