<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

defineProps<{ collapsed: boolean }>();

const route = useRoute();
const authStore = useAuthStore();

const navItems = computed<NavigationMenuItem[]>(() => [

  {
    label: "Leaderboard",
    icon: "material-symbols-light:leaderboard-rounded",
    to: "/dashboard/leaderboard",
    active: route.path === "/dashboard/leaderboard",
  },
  {
    label: "Log Game",
    icon: "tabler:device-gamepad",
    to: "/dashboard/log-game",
    active: route.path === "/dashboard/log-game",
  },
]);

const accountItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "profile",
    icon: "pajamas:profile",
  },
  {
    label: "Logout",
    icon: "tabler:logout",
    onSelect: () => authStore.signOut(),
  },
]);
</script>

<template>
  <UNavigationMenu
    :collapsed="collapsed"
    :items="navItems"
    orientation="vertical"
    :tooltip="true"
  />

  <UNavigationMenu
    :collapsed="collapsed"
    :items="accountItems"
    orientation="vertical"
    class="sidebar__nav--bottom"
    :tooltip="true"
  />
</template>

<style scoped>
.sidebar__kbd {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  margin-inline-start: auto;
}

.sidebar__nav--bottom {
  margin-top: auto;
}
</style>
