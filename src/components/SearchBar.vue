<template>
  <form class="search" @submit.prevent="handleSubmit">
    <div class="search__field">
      <span class="search__icon">🔍</span>
      <input
        v-model="query"
        class="search__input"
        type="text"
        name="city"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
      />
    </div>
    <button class="search__button" type="submit" :disabled="disabled || !query">
      Search
    </button>
    <button
      class="search__gps"
      type="button"
      :disabled="disabled"
      title="Use my current location"
      @click="emit('use-location')"
    >
      📍
    </button>
  </form>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Search for a city...",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "search",
  "debounced-search",
  "use-location",
]);

const query = ref(props.modelValue);
let debounceTimer = null;

watch(
  () => props.modelValue,
  (value) => {
    if (value !== query.value) {
      query.value = value;
    }
  }
);

watch(query, (value) => {
  emit("update:modelValue", value);
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (value.trim()) {
      emit("debounced-search", value.trim());
    }
  }, 500);
});

const handleSubmit = () => {
  const value = query.value.trim();
  if (!value) return;
  emit("search", value);
};

onUnmounted(() => {
  clearTimeout(debounceTimer);
});
</script>

<style scoped>
.search {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
}

.search__field {
  position: relative;
  display: flex;
  align-items: center;
}

.search__icon {
  position: absolute;
  left: 1rem;
  font-size: 1rem;
  opacity: 0.65;
}

.search__input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.5rem;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: inherit;
  transition:
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.search__input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
}

.search__button,
.search__gps {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 600;
  padding: 0.85rem 1.5rem;
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.search__button {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.35),
    rgba(255, 255, 255, 0.15)
  );
  color: inherit;
}

.search__gps {
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.18);
}

.search__button:hover,
.search__gps:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
}

.search__button:disabled,
.search__gps:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

@media (max-width: 640px) {
  .search {
    grid-template-columns: 1fr;
  }

  .search__button,
  .search__gps {
    width: 100%;
  }
}
</style>
