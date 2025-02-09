<template>
  <section class="details">
    <article class="details__item">
      <IconBadge class="details__icon" name="humidity" label="Humidity" />
      <div>
        <p class="details__label">Humidity</p>
        <p class="details__value">{{ current.humidity }}%</p>
      </div>
    </article>
    <article class="details__item">
      <IconBadge class="details__icon" name="wind" label="Wind speed" />
      <div>
        <p class="details__label">Wind speed</p>
        <p class="details__value">{{ windSpeed }}</p>
      </div>
    </article>
    <article class="details__item">
      <IconBadge class="details__icon" name="pressure" label="Air pressure" />
      <div>
        <p class="details__label">Pressure</p>
        <p class="details__value">{{ current.pressure }} hPa</p>
      </div>
    </article>
    <article class="details__item">
      <IconBadge class="details__icon" name="visibility" label="Visibility" />
      <div>
        <p class="details__label">Visibility</p>
        <p class="details__value">{{ visibility }}</p>
      </div>
    </article>
    <article class="details__item">
      <IconBadge class="details__icon" name="uv" label="UV index" />
      <div>
        <p class="details__label">UV index</p>
        <p class="details__value">{{ uvIndex }}</p>
      </div>
    </article>
    <article class="details__item">
      <IconBadge class="details__icon" name="sunrise" label="Sunrise" />
      <div>
        <p class="details__label">Sunrise</p>
        <p class="details__value">{{ sunrise }}</p>
      </div>
    </article>
    <article class="details__item">
      <IconBadge class="details__icon" name="sunset" label="Sunset" />
      <div>
        <p class="details__label">Sunset</p>
        <p class="details__value">{{ sunset }}</p>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { formatSunTime } from "../utils/dateFormatter.js";
import IconBadge from "./ui/IconBadge.vue";

const props = defineProps({
  current: {
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

const windSpeed = computed(() =>
  props.unit === "imperial"
    ? `${Math.round(props.current.windSpeed)} mph`
    : `${Math.round(props.current.windSpeed)} km/h`
);

const visibility = computed(() =>
  props.current.visibility ? `${(props.current.visibility / 1000).toFixed(1)} km` : "--"
);

const uvIndex = computed(() =>
  props.current.uvi !== null ? props.current.uvi.toFixed(1) : "--"
);

const sunrise = computed(() => formatSunTime(props.current.sunrise, props.timezone));
const sunset = computed(() => formatSunTime(props.current.sunset, props.timezone));
</script>

<style scoped>
.details {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  padding: 1.5rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.15);
}

.details__item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    background 0.35s ease;
}

.details__icon {
  flex-shrink: 0;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;
}
.details__label {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.75;
}

.details__value {
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.details__item:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.2);
  background: rgba(255, 255, 255, 0.16);
}

.details__item:hover .details__icon {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.24);
}

@media (max-width: 640px) {
  .details {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }
}
</style>
