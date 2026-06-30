import { authClient } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  // Pass Nuxt's useFetch so better-auth checks the session through the SSR-aware
  // fetch that forwards the login cookie to the server.
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value) {
    return navigateTo("/");
  }
});
