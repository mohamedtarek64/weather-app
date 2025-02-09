<template>
  <header class="header">
    <div class="header__brand">
      <div class="header__logo">🌤️</div>
      <div>
        <h1 class="header__title">SkyCast</h1>
        <p class="header__subtitle">Live weather updates wherever you are</p>
      </div>
    </div>

    <div class="header__actions">
      <SearchBar
        v-model="query"
        :disabled="disabled"
        @search="handleSearch"
        @debounced-search="handleDebounced"
        @use-location="emit('use-location')"
      />

      <div class="header__controls">
        <button class="header__toggle" type="button" @click="emit('toggle-units')">
          {{ unitLabel }}
        </button>
        <button
          class="header__refresh"
          type="button"
          :disabled="disabled"
          @click="emit('refresh')"
        >
          🔄 Refresh
        </button>
      </div>

      <ul v-if="recentSearches.length" class="header__history">
        <li v-for="city in recentSearches" :key="city">
          <button class="history__item" type="button" @click="emit('search', city)">
            {{ city }}
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import SearchBar from "./SearchBar.vue";

const props = defineProps({
  currentUnit: {
    type: String,
    default: "metric",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  recentSearches: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["search", "toggle-units", "use-location", "refresh"]);

const query = ref("");

watch(
  () => props.recentSearches,
  (value) => {
    if (!query.value && value?.[0]) {
      query.value = value[0];
    }
  },
  { immediate: true }
);

const unitLabel = computed(() =>
  props.currentUnit === "metric" ? "°C / °F" : "°F / °C"
);

const handleSearch = (value) => {
  if (!value) return;
  emit("search", value);
};

const handleDebounced = (value) => {
  if (!value) return;
  emit("search", value);
};
</script>

<style scoped>
.header {
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 40px rgba(15, 23, 42, 0.15);
}

.header__brand {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.header__logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 1.8rem;
}

.header__title {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  letter-spacing: -0.02em;
}

.header__subtitle {
  margin: 0.15rem 0 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95rem;
}

.header__actions {
  display: grid;
  gap: 1rem;
}

.header__controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.header__toggle,
.header__refresh {
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  backdrop-filter: blur(12px);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.header__toggle:hover,
.header__refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
}

.header__refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.header__history {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.history__item {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  background: rgba(255, 255, 255, 0.14);
  color: inherit;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.history__item:hover {
  background: rgba(255, 255, 255, 0.24);
  transform: translateY(-1px);
}

@media (min-width: 960px) {
  .header {
    grid-template-columns: auto 1fr;
    align-items: center;
  }

  .header__actions {
    gap: 1.25rem;
  }
}
</style>
