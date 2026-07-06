<script lang="ts" setup>
import { motion, MotionConfig } from "motion-v";

const authStore = useAuthStore();
const { user, loading } = storeToRefs(authStore);

const gamesPlayed = computed(() => (user.value ? user.value.totalWins + user.value.totalLosses : 0));
const hasPlayed = computed(() => gamesPlayed.value > 0);
const winRate = computed(() => (gamesPlayed.value ? Math.round((user.value!.totalWins / gamesPlayed.value) * 100) : 0));

const joined = computed(() => {
  if (!user.value?.createdAt)
    return "";
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(user.value.createdAt));
});

// Card accent per tone — bound via inline style, so adding a tone needs no new CSS rule.
const STAT_TONES = {
  gold: { accent: "color-mix(in oklch, var(--color-sporty-500) 55%, var(--ui-border))", icon: "var(--color-sporty-700)" },
  mint: { accent: "color-mix(in oklch, var(--color-mint-500) 45%, var(--ui-border))", icon: "var(--color-mint-600)" },
  bishop: { accent: "color-mix(in oklch, var(--color-bishop-500) 45%, var(--ui-border))", icon: "var(--color-bishop-500)" },
  sapphire: { accent: "color-mix(in oklch, var(--color-sapphire-500) 45%, var(--ui-border))", icon: "var(--color-sapphire-500)" },
} as const;

// One row per stat card — add a stat by adding an entry here, nothing else.
const stats = computed(() => [
  {
    key: "score",
    label: "Cumulative score",
    value: user.value?.cumulativeScore ?? 0,
    hint: "points banked",
    icon: "tabler:coins",
    tone: "gold" as const,
  },
  {
    key: "wins",
    label: "Total wins",
    value: user.value?.totalWins ?? 0,
    hint: `${winRate.value}% win rate`,
    icon: "tabler:trophy",
    tone: "mint" as const,
  },
  {
    key: "losses",
    label: "Total losses",
    value: user.value?.totalLosses ?? 0,
    hint: `${100 - winRate.value}% loss rate`,
    icon: "tabler:mood-sad",
    tone: "bishop" as const,
  },
  {
    key: "games",
    label: "Games played",
    value: gamesPlayed.value,
    hint: "sessions logged",
    icon: "tabler:cards",
    tone: "sapphire" as const,
  },
]);
</script>

<template>
  <MotionConfig reduced-motion="user">
    <div class="profile">
      <div class="profile__mesh" aria-hidden="true">
        <span class="blob blob--sapphire" />
        <span class="blob blob--mint" />
        <span class="blob blob--sporty" />
      </div>

      <header class="profile__head">
        <span class="eyebrow">
          <span class="eyebrow__dots" aria-hidden="true"><i /><i /><i /><i /></span>
          Player profile
        </span>

        <h1 class="profile__title">
          Your <span class="hl">stats</span>
        </h1>

        <p class="profile__lead">
          Everything banked under your name — wins, losses and the score
          you've racked up along the way.
        </p>
      </header>

      <!-- Loading -->
      <div
        v-if="loading"
        class="skeletons"
        aria-hidden="true"
      >
        <div class="identity">
          <USkeleton class="size-20 rounded-full" />
          <div class="skeletons__lines">
            <USkeleton class="h-5 w-40 rounded-md" />
            <USkeleton class="h-4 w-56 rounded-md" />
          </div>
        </div>
        <div class="stats">
          <USkeleton
            v-for="i in 4"
            :key="i"
            class="h-28 rounded-2xl"
          />
        </div>
      </div>

      <template v-else>
        <!-- Identity -->
        <motion.section
          class="identity"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4 }"
        >
          <UAvatar
            :src="user?.image ?? undefined"
            :alt="user?.name"
            size="3xl"
            class="identity__avatar"
          />
          <div class="identity__info">
            <h2 class="identity__name">
              {{ user?.name }}
            </h2>
            <p class="identity__meta">
              <UIcon name="tabler:mail" class="size-4" />
              {{ user?.email }}
            </p>
            <p v-if="joined" class="identity__meta">
              <UIcon name="tabler:calendar" class="size-4" />
              Playing since {{ joined }}
            </p>
          </div>
        </motion.section>

        <!-- Empty state: never played / never involved in a game -->
        <motion.div
          v-if="!hasPlayed"
          class="empty-state"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.1 }"
        >
          <UIcon name="tabler:trophy-off" class="empty-state__icon" />
          <p class="empty-state__title">
            No games logged yet
          </p>
          <p class="empty-state__lead">
            Play your first round and your score, wins and losses will show
            up right here.
          </p>
          <UButton to="/dashboard/log-game" icon="tabler:cards">
            Log a game
          </UButton>
        </motion.div>

        <!-- Stats -->
        <div v-else class="stats">
          <motion.div
            v-for="(s, i) in stats"
            :key="s.key"
            class="stat-card"
            :style="{ '--stat-accent': STAT_TONES[s.tone].accent, '--stat-icon-fg': STAT_TONES[s.tone].icon }"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.35, delay: 0.1 + i * 0.08 }"
          >
            <span class="stat-card__icon">
              <UIcon :name="s.icon" class="size-5" />
            </span>
            <span class="stat-card__value">{{ s.value.toLocaleString() }}</span>
            <span class="stat-card__label">{{ s.label }}</span>
            <span class="stat-card__hint">{{ s.hint }}</span>
          </motion.div>
        </div>
      </template>
    </div>
  </MotionConfig>
</template>

<style scoped>
.profile {
  position: relative;
  isolation: isolate;
  max-width: 56rem;
  margin-inline: auto;
}

/* ------------------------------- background ------------------------------ */

.profile__mesh {
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

.profile__head {
  margin-bottom: 2.25rem;
}

.profile__title {
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
  background: linear-gradient(135deg, var(--color-sapphire-500), var(--color-mint-500));
  border-radius: 0.16em;
  transform: rotate(-2deg);
  box-shadow: 0 14px 30px -14px color-mix(in oklch, var(--color-sapphire-500) 75%, transparent);
}

.profile__lead {
  margin-top: 0.85rem;
  max-width: 34rem;
  color: var(--ui-text-muted);
  text-wrap: pretty;
}

/* ------------------------------- skeletons ------------------------------- */

.skeletons__lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* -------------------------------- identity -------------------------------- */

.identity {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 1.75rem;
  border-radius: 1.25rem;
  border: 1px solid var(--ui-border);
  background: color-mix(in oklch, var(--ui-bg-elevated) 85%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.identity__avatar {
  flex-shrink: 0;
  outline: 3px solid var(--ui-bg);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-sapphire-500) 45%, transparent);
  transition: box-shadow 0.25s;
}

.identity:hover .identity__avatar {
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-sapphire-500) 75%, transparent);
}

.identity__info {
  min-width: 0;
}

.identity__name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.identity__meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.3rem;
  font-size: 0.85rem;
  color: var(--ui-text-muted);
}

/* ----------------------------- empty state -------------------------------- */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 3.5rem 1.5rem;
  border: 1px dashed var(--ui-border);
  border-radius: 1.5rem;
  text-align: center;
}

.empty-state__icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--ui-text-dimmed);
}

.empty-state__title {
  font-weight: 700;
  font-size: 1.1rem;
}

.empty-state__lead {
  max-width: 26rem;
  color: var(--ui-text-muted);
  margin-bottom: 0.5rem;
}

/* --------------------------------- stats ----------------------------------- */

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 40rem) {
  .stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid var(--stat-accent, var(--ui-border));
  background:
    radial-gradient(
      120% 100% at 0% 0%,
      color-mix(in oklch, var(--stat-accent, transparent) 16%, transparent),
      transparent 65%
    ),
    color-mix(in oklch, var(--ui-bg-elevated) 85%, transparent);
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    border-color 0.25s;
}

.stat-card:hover,
.stat-card:focus-within {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px -22px color-mix(in oklch, var(--stat-accent, transparent) 55%, transparent);
}

.stat-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-bottom: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--stat-accent);
  background: color-mix(in oklch, var(--stat-accent) 18%, transparent);
  color: var(--stat-icon-fg);
  transition: transform 0.25s;
}

.stat-card:hover .stat-card__icon {
  transform: scale(1.12) rotate(-4deg);
}

.stat-card__value {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat-card__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ui-text);
}

.stat-card__hint {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}

/* ---------------------------- reduced motion ------------------------------ */

@media (prefers-reduced-motion: reduce) {
  .identity__avatar,
  .stat-card,
  .stat-card__icon {
    transition: none;
  }
}
</style>
