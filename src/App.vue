<template>
  <div :class="['app', backgroundTheme]">
    <div class="app__overlay"></div>
    <div class="app__content">
      <WeatherHeader
        :current-unit="units"
        :disabled="loading"
        :recent-searches="recentSearches"
        @search="handleSearch"
        @toggle-units="handleToggleUnits"
        @use-location="handleUseLocation"
        @refresh="handleRefresh"
      />

      <transition name="fade" mode="out-in">
        <LoadingSpinner v-if="loading" key="loading" />
        <ErrorMessage
          v-else-if="error"
          key="error"
          :message="error.message"
          @retry="handleRetry"
        />
        <main v-else key="content" class="app__grid">
          <CurrentWeather
            v-if="current && meta"
            :current="current"
            :meta="meta"
            :unit="units"
          />

          <WeatherDetails
            v-if="current"
            :current="current"
            :unit="units"
            :timezone="meta?.timezone"
          />

          <ForecastList
            v-if="forecast.length"
            :items="forecast"
            :unit="units"
            :timezone="meta?.timezone"
          />
        </main>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import WeatherHeader from "./components/WeatherHeader.vue";
import CurrentWeather from "./components/CurrentWeather.vue";
import WeatherDetails from "./components/WeatherDetails.vue";
import ForecastList from "./components/ForecastList.vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import ErrorMessage from "./components/ErrorMessage.vue";
import { useWeather } from "./composables/useWeather.js";
import { useGeolocation } from "./composables/useGeolocation.js";
import { useLocalStorage } from "./composables/useLocalStorage.js";

const {
  current,
  meta,
  daily: forecast,
  loading,
  error,
  units,
  backgroundTheme,
  recentSearches,
  fetchWeatherByCity,
  fetchWeatherByCoords,
  toggleUnits,
  refreshWeather,
} = useWeather();

const { coords, error: geoError, getLocation } = useGeolocation();
const lastCityStorage = useLocalStorage("weather:last-city");

const handleSearch = async (value) => {
  await fetchWeatherByCity(value);
};

const handleUseLocation = () => {
  getLocation();
};

const handleToggleUnits = () => {
  toggleUnits();
};

const handleRetry = () => {
  refreshWeather();
};

const handleRefresh = () => {
  refreshWeather();
};

watch(coords, async (value) => {
  if (!value) return;
  await fetchWeatherByCoords(value.lat, value.lon);
});

watch(geoError, async (value) => {
  if (value) {
    error.value = value;
    if (!current.value) {
      const fallback = lastCityStorage.get("Cairo") || "Cairo";
      await fetchWeatherByCity(fallback, { persist: false });
    }
  }
});

onMounted(async () => {
  const savedCity = lastCityStorage.get("");
  if (savedCity) {
    await fetchWeatherByCity(savedCity, { persist: false });
  } else {
    getLocation();
  }
});
</script>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
  color: #ffffff;
  transition: background 0.6s ease;
  background-size: 200% 200%;
  animation: gradient-pan 28s ease-in-out infinite alternate;
  overflow: hidden;
}

.app__overlay {
  position: absolute;
  inset: 0;
  background: rgba(12, 16, 38, 0.35);
  pointer-events: none;
  z-index: 0;
}

.app__content {
  position: relative;
  z-index: 1;
  padding: clamp(1.5rem, 4vw, 3rem);
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.app__grid {
  display: grid;
  gap: 1.75rem;
}

@media (min-width: 1024px) {
  .app__grid {
    grid-template-columns: 1.2fr 1fr;
    grid-template-rows: auto auto;
  }

  .app__grid > :first-child {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .app__grid > :nth-child(2) {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  .app__grid > :nth-child(3) {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes gradient-pan {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>
