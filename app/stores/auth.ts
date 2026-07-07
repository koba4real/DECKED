import type { auth, UserWithId } from "~~/lib/auth";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

  // Resolve the session through Nuxt's SSR-aware fetch so the user is known on
  // the server render, not just after the client hydrates. Called from app.vue.
  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user as UserWithId | undefined);
  const loading = computed(() => session.value?.isPending);

  async function signIn(provider: "github" | "google") {
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard/leaderboard",
        errorCallbackURL: "/login",
      });
      if (error) {
        throw new Error(error.message ?? "Unable to start sign in.");
      }
    }
    catch (err) {
      toastError("Sign in failed", err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  async function signOut() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        throw new Error(error.message ?? "Unable to sign out.");
      }
      await navigateTo("/");
    }
    catch (err) {
      toastError("Sign out failed", err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return { init, loading, signIn, signOut, user };
});
