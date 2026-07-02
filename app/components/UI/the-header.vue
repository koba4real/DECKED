<script setup lang="ts">
import AuthButton from "./auth-button.vue";

// Guest-facing site header: brand on the left, theme toggle and the
// GitHub sign-in call-to-action on the right.
</script>

<template>
  <UHeader to="/" :ui="{ container: 'max-w-full px-4 sm:px-6' }">
    <template #title>
      <span class="brand">
        <UIcon name="tabler:map-pins" class="brand__icon" />
        DECKED
      </span>
    </template>

    <template #right>
      <UColorModeButton />

      <AuthButton />
    </template>
  </UHeader>
</template>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
}

.brand__icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--ui-primary);
}
</style>
