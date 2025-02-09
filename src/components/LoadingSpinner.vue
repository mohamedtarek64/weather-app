<template>
  <div class="spinner">
    <div class="spinner__orbit"></div>
    <div class="spinner__core"></div>
    <p class="spinner__text">Loading weather data...</p>
  </div>
</template>

<style scoped>
.spinner {
  display: grid;
  place-items: center;
  gap: 1.5rem;
  padding: 3rem 1rem;
}

.spinner__orbit {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 6px solid rgba(255, 255, 255, 0.15);
  border-top-color: rgba(255, 255, 255, 0.8);
  animation: spin 1.1s linear infinite;
  position: relative;
}

.spinner__core {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  animation: pulse 1.8s ease-in-out infinite;
  position: absolute;
}

.spinner__text {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.25);
    opacity: 0.6;
  }
}
</style>
