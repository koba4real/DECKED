<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const errorMessage = props.error.statusText || props.error.message || "Unknown error";
</script>

<template>
  <div class="error-page">
    <div class="error-card">
      <UAlert
        color="error"
        title="Ooh no!"
        :description="errorMessage"
        icon="tabler:alert-triangle"
        class="error-alert"
      />
      <UButton
        label="Go back home"
        icon="tabler:arrow-left"
        color="neutral"
        variant="subtle"
        class="back-btn"
        @click="clearError({ redirect: '/' })"
      />
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 28rem;
  width: 100%;
}

.error-alert {
  width: 100%;
}

.back-btn {
  align-self: flex-start;
}
</style>
