<template>
  <span
    class="icon-badge"
    :class="[`icon-badge--${name}`]"
    :aria-label="label"
    role="img"
  >
    <svg
      v-if="name === 'humidity'"
      class="icon-badge__svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M12 2c-3.5 4-6 6.9-6 10.6 0 4.03 3.16 7.4 7 7.4s7-3.37 7-7.4C20 8.9 15.5 4.5 12 2Z"
        opacity="0.75"
      />
      <path
        d="M12 6.25c-2.25 2.58-3.75 4.54-3.75 6.35 0 2.45 1.7 4.35 3.75 4.35S15.75 15 15.75 12.6C15.75 10.8 14.2 8.83 12 6.25Z"
      />
    </svg>

    <svg
      v-else-if="name === 'wind'"
      class="icon-badge__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 9.5h9.5a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 14h13.5a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M6 12h7.5" opacity="0.7" />
    </svg>

    <svg
      v-else-if="name === 'pressure'"
      class="icon-badge__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="6" opacity="0.6" />
      <path d="M12 8v4l3 1.5" />
      <circle cx="12" cy="12" r="9" opacity="0.35" />
    </svg>

    <svg
      v-else-if="name === 'visibility'"
      class="icon-badge__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M2.5 12c2-3.7 5.75-6 9.5-6s7.5 2.3 9.5 6c-2 3.7-5.75 6-9.5 6s-7.5-2.3-9.5-6Z"
        opacity="0.6"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>

    <svg
      v-else-if="name === 'uv'"
      class="icon-badge__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 3v2.5M12 18.5V21M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M3 12h2.5M18.5 12H21M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77"
      />
    </svg>

    <svg
      v-else-if="name === 'sunrise'"
      class="icon-badge__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4.5 15.5h15" opacity="0.6" />
      <path d="M7 18h10" opacity="0.4" />
      <path d="M12 6.5V3" />
      <path d="M8.5 10.5 12 7l3.5 3.5" />
      <path d="M6 13a6 6 0 1 1 12 0" opacity="0.7" />
    </svg>

    <svg
      v-else-if="name === 'sunset'"
      class="icon-badge__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4.5 15.5h15" opacity="0.6" />
      <path d="M7 18h10" opacity="0.4" />
      <path d="M12 10.5V7" />
      <path d="M15.5 13.5 12 17l-3.5-3.5" />
      <path d="M6 13a6 6 0 1 1 12 0" opacity="0.7" />
    </svg>

    <svg
      v-else-if="name === 'precipitation'"
      class="icon-badge__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M12 3.5c-2.5 2.8-4 4.9-4 7.3a4 4 0 1 0 8 0c0-2.4-1.5-4.5-4-7.3Z"
        fill="currentColor"
        opacity="0.8"
        stroke="none"
      />
      <path d="M8.5 18.5 7 21M12 18.5l-1.5 2.5M15.5 18.5 14 21" />
    </svg>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: undefined,
  },
});

const label = computed(() => props.label ?? props.name.replace(/-/g, " "));
</script>

<style scoped>
.icon-badge {
  display: inline-flex;
  width: 2.35rem;
  height: 2.35rem;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 3px rgba(255, 255, 255, 0.35),
    0 6px 18px rgba(15, 23, 42, 0.22);
  color: rgba(255, 255, 255, 0.92);
}

.icon-badge__svg {
  width: 1.45rem;
  height: 1.45rem;
}

.icon-badge--wind,
.icon-badge--visibility {
  color: #c8ddff;
}

.icon-badge--pressure {
  color: #ffdca8;
}

.icon-badge--uv {
  color: #ffe79b;
}

.icon-badge--sunrise,
.icon-badge--sunset {
  color: #ffd0a6;
}

.icon-badge--precipitation {
  color: #a4d8ff;
}
</style>
