<template>
  <article class="forecast-card">
    <p class="forecast-card__day">{{ dayName }}</p>
    <WeatherIcon
      v-if="iconName"
      class="forecast-card__icon"
      :name="iconName"
      :size="72"
      :label="item.description"
    />
    <img
      v-else-if="item.iconUrl"
      class="forecast-card__icon-image"
      :src="item.iconUrl"
      :alt="item.description"
    />
    <p class="forecast-card__temps">
      <span class="forecast-card__temp-high">{{ high }}</span>
      <span class="forecast-card__temp-low">{{ low }}</span>
    </p>
    <p class="forecast-card__rain">
      <IconBadge
        class="forecast-card__rain-icon"
        name="precipitation"
        label="Precipitation chance"
      />
      <span>{{ item.pop }}%</span>
    </p>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { formatTemp } from "../utils/temperatureConverter.js";
import { getDayName } from "../utils/dateFormatter.js";
import { getWeatherIconName } from "../utils/weatherIcons.js";
import WeatherIcon from "./ui/WeatherIcon.vue";
import IconBadge from "./ui/IconBadge.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  unit: {
    type: String,
    default: "metric",
  },
  timezone: {
    type: String,
    default: undefined,
  },
});

const high = formatTemp(props.item.tempMax, props.unit);
const low = formatTemp(props.item.tempMin, props.unit);
const dayName = computed(() => getDayName(props.item.dt, props.timezone));
const iconName = computed(() =>
  getWeatherIconName(props.item.condition ?? props.item.icon ?? "")
);
</script>

<style scoped>
.forecast-card {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 20px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0.08)
  );
  background-size: 200% 200%;
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  text-align: center;
  transform: translateY(0);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    background-position 1.2s ease;
  animation:
    slide-up 0.4s ease both,
    card-glow 16s ease-in-out infinite alternate;
}

.forecast-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.18);
  background-position: 100% 0;
}

.forecast-card__day {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.forecast-card__icon,
.forecast-card__icon-image {
  width: 72px;
  margin: 0 auto;
  display: block;
}

.forecast-card__icon-image {
  filter: drop-shadow(0 12px 24px rgba(15, 23, 42, 0.2));
}

.forecast-card__temps {
  margin: 0;
  font-weight: 600;
  display: flex;
  justify-content: center;
  gap: 0.65rem;
}

.forecast-card__temp-high {
  color: rgba(255, 255, 255, 0.95);
}

.forecast-card__temp-low {
  color: rgba(255, 255, 255, 0.65);
}

.forecast-card__rain {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.85;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
}

.forecast-card__rain-icon {
  width: 2rem;
  height: 2rem;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes card-glow {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}
</style>
