<script setup lang="ts">

</script>

<template>
  <UDashboardSidebar
    id="default"
    collapsible
    resizable
  >
    <template #default="{ collapsed }">
      <UDashboardSidebarCollapse />

      <SidebarDefault :collapsed="collapsed" />
    </template>
  </UDashboardSidebar>
</template>
