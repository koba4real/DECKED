<script lang="ts" setup>
// Log-game screen: playful hero header over the form panel, on the DECKED palette.
</script>

<template>
  <div class="log-game">
    <div class="log-game__mesh" aria-hidden="true">
      <span class="blob blob--sapphire" />
      <span class="blob blob--mint" />
      <span class="blob blob--sporty" />
    </div>

    <header class="log-game__head">
      <span class="eyebrow">
        <span class="eyebrow__dots" aria-hidden="true"><i /><i /><i /><i /></span>
        Log a game
      </span>

      <h1 class="log-game__title">
        Who <span class="hl">won</span>?
      </h1>

      <p class="log-game__lead">
        Drop in the players, crown the winner and set the ruleset — we'll bank
        the score and move the standings.
      </p>
    </header>

    <LogGameForm class="log-game__form" />
  </div>
</template>

<style scoped>
.log-game {
  position: relative;
  isolation: isolate;
  max-width: 44rem;
  margin-inline: auto;
  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
}

/* ------------------------------- background ------------------------------ */

.log-game__mesh {
  position: absolute;
  inset: -7rem -5rem auto;
  height: 28rem;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  /* Feather the clip box: the blurred blobs fade out before the boundary, so
     there's never a hard cropped edge — at any viewport width. overflow:hidden
     stays to keep the blobs from forcing a horizontal scrollbar on mobile.
     closest-side reaches exactly to each nearest edge, so every side fades to
     transparent no matter the box's (wide, short) aspect ratio. */
  -webkit-mask-image: radial-gradient(ellipse closest-side at 50% 38%, #000 36%, transparent 100%);
  mask-image: radial-gradient(ellipse closest-side at 50% 38%, #000 36%, transparent 100%);
}

.blob {
  position: absolute;
  width: 24rem;
  height: 24rem;
  border-radius: 9999px;
  filter: blur(120px);
  opacity: 0.16;
}

.blob--sapphire {
  top: -6rem;
  left: -4rem;
  background: var(--color-sapphire-500);
}
.blob--mint {
  top: -3rem;
  right: -2rem;
  background: var(--color-mint-500);
}
.blob--sporty {
  top: 4rem;
  left: 40%;
  background: var(--color-sporty-500);
  opacity: 0.1;
}

/* --------------------------------- header -------------------------------- */

.log-game__head {
  margin-bottom: 1.75rem;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid var(--ui-border);
  background: color-mix(in oklch, var(--ui-bg-elevated) 70%, transparent);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ui-text-muted);
}

.eyebrow__dots {
  display: inline-flex;
  gap: 0.2rem;
}

.eyebrow__dots i {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 9999px;
}
.eyebrow__dots i:nth-child(1) {
  background: var(--color-sporty-500);
}
.eyebrow__dots i:nth-child(2) {
  background: var(--color-sapphire-500);
}
.eyebrow__dots i:nth-child(3) {
  background: var(--color-mint-500);
}
.eyebrow__dots i:nth-child(4) {
  background: var(--color-bishop-500);
}

.log-game__title {
  margin-top: 1rem;
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

.hl {
  display: inline-block;
  padding: 0 0.18em 0.04em;
  margin-inline: 0.04em;
  color: white;
  background: linear-gradient(135deg, var(--color-sporty-500), var(--color-bishop-500));
  border-radius: 0.16em;
  transform: rotate(-2deg);
  box-shadow: 0 14px 30px -14px color-mix(in oklch, var(--color-sporty-500) 75%, transparent);
}

.log-game__lead {
  margin-top: 0.85rem;
  max-width: 34rem;
  color: var(--ui-text-muted);
  text-wrap: pretty;
}
</style>
