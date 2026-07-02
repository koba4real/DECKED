<script setup lang="ts">
// Resolve the session during SSR so auth-aware UI (header, redirects) is correct
// on first paint across every page, not just the dashboard.
await useAuthStore().init();
</script>

<template>
  <UApp :toaster="{ position: 'top-right', expand: false }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
