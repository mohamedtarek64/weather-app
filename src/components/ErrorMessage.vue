<template>
  <section class="error">
    <div class="error__icon">⚠️</div>
    <div class="error__body">
      <h3>Something went wrong</h3>
      <p>{{ message }}</p>
      <button type="button" @click="emit('retry')">Try again</button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "We couldn’t load the weather data. Please try again.",
  },
});

const emit = defineEmits(["retry"]);
</script>

<style scoped>
.error {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid rgba(255, 107, 107, 0.4);
  background: rgba(255, 107, 107, 0.12);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 36px rgba(255, 107, 107, 0.2);
}

.error__icon {
  font-size: 2.25rem;
}

.error__body h3 {
  margin: 0;
  font-size: 1.4rem;
}

.error__body p {
  margin: 0.5rem 0 1.25rem;
  color: rgba(255, 255, 255, 0.85);
}

.error__body button {
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.error__body button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(255, 107, 107, 0.25);
}
</style>
