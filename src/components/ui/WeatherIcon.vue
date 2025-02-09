<!-- eslint-disable vue/no-v-html -->
<template>
  <span class="weather-icon" :style="sizeStyle" role="img" :aria-label="ariaLabel">
    <svg
      v-if="definition"
      :viewBox="definition.viewBox"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ color }"
      class="weather-icon__svg"
      v-html="definition.body"
    />
  </span>
</template>

<script setup>
import { computed } from "vue";
import { getWeatherIconDefinition } from "@weather-icons";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 96,
  },
  color: {
    type: String,
    default: "currentColor",
  },
  label: {
    type: String,
    default: undefined,
  },
});

const definition = computed(() => getWeatherIconDefinition(props.name));

const sizeStyle = computed(() => {
  const sizeValue =
    typeof props.size === "number" ? `${props.size}px` : String(props.size);
  return {
    width: sizeValue,
    height: sizeValue,
  };
});

const ariaLabel = computed(() => props.label ?? props.name.replace(/-/g, " "));
</script>

<style scoped>
.weather-icon {
  display: inline-block;
  line-height: 0;
}

.weather-icon__svg {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 18px 35px rgba(15, 23, 42, 0.25));
}
</style>
