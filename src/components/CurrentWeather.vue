<template>
  <section v-if="current" class="current" :class="{ 'is-night': current.isNight }">
    <div class="current__top">
      <div class="current__location">
        <h2 class="current__city">
          {{ locationLabel }}
          <span class="current__emoji">{{ emoji }}</span>
        </h2>
        <p class="current__datetime">{{ dateTime }}</p>
      </div>

      <div class="current__temp">
        <img v-if="current.iconUrl" :src="current.iconUrl" :alt="current.description" />
        <div class="current__temp-values">
          <span class="current__value">{{ primaryTemp }}</span>
          <span class="current__description">{{ description }}</span>
          <span class="current__feels">Feels like {{ feelsLike }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { formatDateTime } from "../utils/dateFormatter.js";
import { formatTemp } from "../utils/temperatureConverter.js";
import { getWeatherEmoji } from "../utils/weatherIcons.js";

const props = defineProps({
  current: {
    type: Object,
    required: true,
  },
  meta: {
    type: Object,
    required: true,
  },
  unit: {
    type: String,
    default: "metric",
  },
});

const locationLabel = computed(() => {
  const { city = "", country = "" } = props.meta ?? {};
  return [city, country].filter(Boolean).join(", ");
});

const primaryTemp = computed(() => formatTemp(props.current?.temp, props.unit));
const feelsLike = computed(() => formatTemp(props.current?.feelsLike, props.unit));

const dateTime = computed(() => formatDateTime(props.current?.dt, props.meta?.timezone));
const description = computed(() => props.current?.description?.toUpperCase?.() ?? "");

const emoji = computed(() =>
  getWeatherEmoji(props.current?.condition ?? props.current?.icon ?? "")
);
</script>

<style scoped>
.current {
  display: grid;
  gap: 1.75rem;
  padding: 2rem;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2);
  animation: fade-in 0.6s ease both;
}

.current.is-night {
  background: rgba(14, 20, 45, 0.35);
  border-color: rgba(120, 147, 255, 0.25);
}

.current__top {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.current__location {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.current__city {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.current__emoji {
  font-size: 2rem;
}

.current__datetime {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
}

.current__temp {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.current__temp img {
  width: clamp(120px, 20vw, 160px);
  filter: drop-shadow(0 12px 32px rgba(15, 23, 42, 0.35));
}

.current__temp-values {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.current__value {
  font-size: clamp(3.4rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
}

.current__description {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
}

.current__feels {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .current {
    padding: 1.5rem;
  }

  .current__temp {
    flex-direction: column;
    align-items: flex-start;
  }

  .current__temp img {
    width: 120px;
  }
}
</style>
