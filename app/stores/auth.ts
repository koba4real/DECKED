import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

  // Resolve the session through Nuxt's SSR-aware fetch so the user is known on
  // the server render, not just after the client hydrates. Called from app.vue.
  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function signIn(provider: "github" | "google") {
    const toast = useToast();
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
        errorCallbackURL: "/login",
      });
      if (error) {
        throw new Error(error.message ?? "Unable to start sign in.");
      }
    }
    catch (err) {
      toast.add({
        title: "Sign in failed",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        color: "error",
        icon: "tabler:alert-triangle",
      });
    }
  }

  async function signOut() {
    const toast = useToast();
    try {
      const { error } = await authClient.signOut();
      if (error) {
        throw new Error(error.message ?? "Unable to sign out.");
      }
      await navigateTo("/");
    }
    catch (err) {
      toast.add({
        title: "Sign out failed",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        color: "error",
        icon: "tabler:alert-triangle",
      });
    }
  }

  return { init, loading, signIn, signOut, user };
});
