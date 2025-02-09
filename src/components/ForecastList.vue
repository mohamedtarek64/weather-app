<template>
  <section class="forecast">
    <header class="forecast__header">
      <h3>Upcoming forecast</h3>
      <span class="forecast__unit">
        {{ unit === "metric" ? "°C" : "°F" }}
      </span>
    </header>

    <TransitionGroup name="forecast" tag="div" class="forecast__grid">
      <ForecastCard
        v-for="item in items"
        :key="item.dt"
        :item="item"
        :unit="unit"
        :timezone="timezone"
      />
    </TransitionGroup>
  </section>
</template>

<script setup>
import ForecastCard from "./ForecastCard.vue";

defineProps({
  items: {
    type: Array,
    default: () => [],
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
</script>

<style scoped>
.forecast {
  display: grid;
  gap: 1.25rem;
  padding: 1.75rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
}

.forecast__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.forecast__header h3 {
  margin: 0;
  font-size: 1.3rem;
  letter-spacing: -0.01em;
}

.forecast__unit {
  font-weight: 600;
  opacity: 0.75;
}

.forecast__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.forecast-enter-active,
.forecast-leave-active {
  transition: all 0.3s ease;
}

.forecast-enter-from,
.forecast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
