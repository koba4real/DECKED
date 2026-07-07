<script lang="ts" setup>
import { MotionConfig } from "motion-v";

const { data: players, error, refresh } = useFetch("/api/leaderboard", {
  key: "leaderboard",
  server: false,
});

// Realtime: any logged game nudges every open leaderboard to refetch.
// EventSource reconnects on its own; while the stream is down the page
// simply behaves like a static leaderboard.
const live = ref(false);
let source: EventSource | undefined;

onMounted(() => {
  source = new EventSource("/api/leaderboard/stream");
  source.onopen = () => {
    live.value = true;
  };
  source.onerror = () => {
    live.value = false;
  };
  source.onmessage = () => refresh();
});
onBeforeUnmount(() => source?.close());

// Loading until the first response lands. Keying off the presence of data (not
// status) keeps server and client agreeing during hydration, and avoids
// flashing the skeleton over existing rows on an SSE-triggered refresh.
const loading = computed(() => !players.value && !error.value);
</script>

<template>
  <MotionConfig reduced-motion="user">
    <div class="board">
      <div class="board__mesh" aria-hidden="true">
        <span class="blob blob--sporty" />
        <span class="blob blob--sapphire" />
        <span class="blob blob--bishop" />
      </div>

      <header class="board__head">
        <div class="board__eyebrow-row">
          <span class="eyebrow">
            <span class="eyebrow__dots" aria-hidden="true"><i /><i /><i /><i /></span>
            Global leaderboard
          </span>
          <span class="live" :class="{ 'live--on': live }">
            <i class="live__dot" aria-hidden="true" />
            {{ live ? "Live" : "Live paused" }}
          </span>
        </div>

        <h1 class="board__title">
          Hall of <span class="hl">fame</span>
        </h1>

        <p class="board__lead">
          Every logged game moves the standings — the crown changes hands
          right here, no refresh needed.
        </p>
      </header>

      <!-- Loading -->
      <div
        v-if="loading"
        class="skeletons"
        aria-hidden="true"
      >
        <div class="skeletons__podium">
          <USkeleton class="h-36 flex-1 rounded-2xl" />
          <USkeleton class="h-48 flex-1 rounded-2xl" />
          <USkeleton class="h-28 flex-1 rounded-2xl" />
        </div>
        <USkeleton
          v-for="i in 4"
          :key="i"
          class="h-14 rounded-2xl"
        />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state">
        <UIcon name="tabler:plug-connected-x" class="state__icon" />
        <p class="state__title">
          Couldn't load the leaderboard
        </p>
        <UButton
          icon="tabler:refresh"
          color="neutral"
          variant="outline"
          @click="refresh()"
        >
          Try again
        </UButton>
      </div>

      <!-- Empty -->
      <div v-else-if="!players?.length" class="state">
        <UIcon name="tabler:trophy-off" class="state__icon" />
        <p class="state__title">
          Nobody on the podium yet
        </p>
        <p class="state__lead">
          Log the first game and watch it light up.
        </p>
        <UButton to="/dashboard/log-game" icon="tabler:cards">
          Log a game
        </UButton>
      </div>

      <template v-else>
        <LeaderboardPodium :players="players" />
        <LeaderboardStandings :players="players" />
      </template>
    </div>
  </MotionConfig>
</template>

<style scoped>
.board {
  position: relative;
  isolation: isolate;
  max-width: 56rem;
  margin-inline: auto;
}

/* ------------------------------- background ------------------------------ */

.board__mesh {
  position: absolute;
  inset: -7rem -5rem auto;
  height: 26rem;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
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

.blob--sporty {
  top: -6rem;
  left: 10%;
  background: var(--color-sporty-500);
}
.blob--sapphire {
  top: -3rem;
  right: -2rem;
  background: var(--color-sapphire-500);
}
.blob--bishop {
  top: 4rem;
  left: -4rem;
  background: var(--color-bishop-500);
  opacity: 0.1;
}

/* --------------------------------- header -------------------------------- */

.board__head {
  margin-bottom: 2.25rem;
}

.board__eyebrow-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.live {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid var(--ui-border);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}

.live__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--ui-border);
}

.live--on {
  border-color: color-mix(in oklch, var(--color-mint-500) 35%, var(--ui-border));
  color: var(--color-mint-600);
}

.live--on .live__dot {
  background: var(--color-mint-500);
}

@media (prefers-reduced-motion: no-preference) {
  .live--on .live__dot {
    animation: live-pulse 2s ease-in-out infinite;
  }
}

@keyframes live-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in oklch, var(--color-mint-500) 45%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px transparent;
  }
}

.board__title {
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

.board__lead {
  margin-top: 0.85rem;
  max-width: 34rem;
  color: var(--ui-text-muted);
  text-wrap: pretty;
}

/* ------------------------------- skeletons ------------------------------- */

.skeletons {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.skeletons__podium {
  display: flex;
  align-items: flex-end;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

/* ----------------------------- empty / error ------------------------------ */

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 3.5rem 1.5rem;
  border: 1px dashed var(--ui-border);
  border-radius: 1.5rem;
  text-align: center;
}

.state__icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--ui-text-dimmed);
}

.state__title {
  font-weight: 700;
  font-size: 1.1rem;
}

.state__lead {
  color: var(--ui-text-muted);
  margin-bottom: 0.5rem;
}
</style>
