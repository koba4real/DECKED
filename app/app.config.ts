// Maps Nuxt UI's semantic color aliases onto the UNO palette (defined in assets/css/main.css).
// primary = Bishop red is the UNO signature; flip to 'sapphire' if you'd rather reserve red for errors only.
export default defineAppConfig({
  ui: {
    colors: {
      primary: "sapphire",
      secondary: "bishop",
      success: "mint",
      info: "sapphire",
      warning: "sporty",
      error: "bishop",
      neutral: "slate",
    },
  },
});
