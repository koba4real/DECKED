<script setup lang="ts">
const authStore = useAuthStore();
const user = authStore.user;
</script>

<template>
  <div>
    <h1>Profile of {{ user?.name }}</h1>
    <p>This is the profile page.</p>
    <UContainer>
      <UCard>
        <h2>User Information</h2>
        <p><strong>Name:</strong> {{ user?.name }}</p>
        <p><strong>Email:</strong> {{ user?.email }}</p>
      </UCard>
      <UCard>
        <h2>Performance Stats</h2>
        <p><strong>Cumulative Score:</strong> {{ user?.cumulativeScore }}</p>
        <p><strong>Total Wins:</strong> {{ user?.totalWins }}</p>
        <p><strong>Total Losses:</strong> {{ user?.totalLosses }}</p>
      </UCard>
    </UContainer>
  </div>
</template>
