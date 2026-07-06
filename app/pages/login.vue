<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();

// Skip the login screen for already-authenticated visitors.
watchEffect(() => {
  if (authStore.user) {
    navigateTo("/dashboard/leaderboard");
  }
});

// Surface OAuth-flow failures redirected back here via ?error=.
onMounted(() => {
  if (route.query.error) {
    toast.add({
      title: "Sign in failed",
      description: "We couldn't sign you in. Please try again.",
      color: "error",
      icon: "tabler:alert-triangle",
    });
  }
});

// better-auth redirects the browser, so keep the clicked button in a loading
// state until navigation happens.
const pendingProvider = ref<"github" | "google" | null>(null);

async function onProvider(provider: "github" | "google") {
  pendingProvider.value = provider;
  try {
    await authStore.signIn(provider);
  }
  finally {
    pendingProvider.value = null;
  }
}

const providers = computed<ButtonProps[]>(() => [
  {
    label: "Continue with GitHub",
    icon: "tabler:brand-github",
    color: "neutral",
    variant: "subtle",
    loading: pendingProvider.value === "github",
    disabled: pendingProvider.value !== null,
    onClick: () => onProvider("github"),
  },
  {
    label: "Continue with Google",
    icon: "tabler:brand-google",
    color: "neutral",
    variant: "subtle",
    loading: pendingProvider.value === "google",
    disabled: pendingProvider.value !== null,
    onClick: () => onProvider("google"),
  },
]);
</script>

<template>
  <div class="login">
    <UAuthForm
      title="Sign in"
      description="Choose a provider to continue."
      :providers="providers"
      class="login__form"
    >
      <template #footer>
        <UButton
          to="/dashboard/leaderboard"
          label="Back to home"
          icon="tabler:arrow-left"
          variant="link"
          color="neutral"
        />
      </template>
    </UAuthForm>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 1rem;
}

.login__form {
  width: 100%;
  max-width: 24rem;
}
</style>
