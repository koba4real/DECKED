<script setup lang="ts">
import type { ButtonProps, DropdownMenuItem } from "@nuxt/ui";

import { useAuthStore } from "~/stores/auth";

const { color = "neutral" } = defineProps<{
  color?: ButtonProps["color"];
}>();

const authStore = useAuthStore();

const items = computed<DropdownMenuItem[]>(() => [
  {
    label: "Log out",
    icon: "tabler:logout",
    onSelect: () => authStore.signOut(),
  },
]);
</script>

<template>
  <UButton
    v-if="authStore.loading && !authStore.user"
    :color="color"
    variant="subtle"
    loading
    disabled
  />

  <UDropdownMenu v-else-if="authStore.user" :items="items">
    <UButton
      variant="ghost"
      color="neutral"
      class="auth-user"
    >
      <UAvatar
        :src="authStore.user.image ?? undefined"
        :alt="authStore.user.name"
        size="sm"
        referrerpolicy="no-referrer"
      />
      <span class="auth-user__name">{{ authStore.user.name }}</span>
    </UButton>
  </UDropdownMenu>

  <UButton
    v-else
    :color="color"
    label="Sign in"
    variant="subtle"
    to="/login"
  />
</template>

<style scoped>
.auth-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-user__name {
  font-weight: 500;
}
</style>
