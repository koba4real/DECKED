import tailwindcss from "@tailwindcss/vite";

// Validate environment variables on startup; throws if any are missing.
import "./lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/icon", "@pinia/nuxt"],
  colorMode: {
    preference: "system", // auto-detect the OS theme until the user overrides
    fallback: "light", // used during SSR / when the OS preference is unknown
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  typescript: {
    // lib/env.ts lands in the node TS project (imported by this config); Nuxt 4
    // generates its tsconfig with types:[], so node globals like `process` need
    // to be re-added here.
    nodeTsConfig: {
      compilerOptions: {
        types: ["node"],
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        "better-auth/vue",
      ],
    },
  },
  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
        global: true,
      },
    ],
  },
});
