<script lang="ts" setup>
import { motion } from "motion-v";

const props = defineProps<{ players: RankedPlayer[] }>();

const podium = computed(() => props.players.slice(0, 3));

// Podium flair by finishing position (index in the top-3 slice, not rank — a
// tie for first still gets distinct steps).
const steps = [
  { medal: "tabler:crown", label: "Champion" },
  { medal: "tabler:medal", label: "Runner-up" },
  { medal: "tabler:medal-2", label: "Third place" },
];

// Hover/focus lifts a podium card; click / Enter expands its full stats.
const expandedId = ref<number>();
function toggleExpanded(id: number) {
  expandedId.value = expandedId.value === id ? undefined : id;
}
</script>

<template>
  <!-- Podium: DOM order 1-2-3 for reading order, CSS reorders to 2-1-3. -->
  <ol class="podium" aria-label="Top three players">
    <motion.li
      v-for="(p, i) in podium"
      :key="p.id"
      class="podium__spot"
      :class="`podium__spot--${i + 1}`"
      :initial="{ opacity: 0, y: 56 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ type: 'spring', stiffness: 130, damping: 16, delay: 0.15 + i * 0.12 }"
    >
      <div class="pod-card" :class="{ 'pod-card--open': expandedId === p.id }">
        <button
          type="button"
          class="pod-card__button"
          :aria-expanded="expandedId === p.id"
          :aria-controls="`pod-details-${p.id}`"
          @click="toggleExpanded(p.id)"
        >
          <span class="pod-card__medal" :title="steps[i]!.label">
            <UIcon :name="steps[i]!.medal" class="size-5" />
          </span>
          <UAvatar
            :src="p.image ?? undefined"
            :alt="p.name"
            :size="i === 0 ? '2xl' : 'xl'"
            class="pod-card__avatar"
          />
          <span class="pod-card__name">{{ p.name }}</span>
          <span class="pod-card__score">
            {{ p.totalScore.toLocaleString() }}<small>pts</small>
          </span>
          <UBadge
            :label="`${p.wins} ${p.wins === 1 ? 'win' : 'wins'}`"
            :color="i === 0 ? 'warning' : 'neutral'"
            variant="soft"
            size="sm"
          />
          <UIcon name="tabler:chevron-down" class="pod-card__chev size-4" />
        </button>

        <div :id="`pod-details-${p.id}`" class="pod-card__more">
          <div>
            <dl class="pod-card__stats">
              <div><dt>Games</dt><dd>{{ p.gamesPlayed }}</dd></div>
              <div><dt>Losses</dt><dd>{{ p.losses }}</dd></div>
              <div><dt>Win rate</dt><dd>{{ p.winRate }}%</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <div class="podium__base">
        <span class="podium__rank">#{{ p.rank }}</span>
      </div>
    </motion.li>
  </ol>
</template>

<style scoped>
.podium {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
  /* medal metals, derived from the UNO palette */
  --gold: var(--color-sporty-500);
  --silver: color-mix(in oklch, var(--ui-text-muted) 60%, var(--ui-bg-elevated));
  --bronze: color-mix(in oklch, var(--color-bishop-500) 55%, var(--color-sporty-600));
}

.podium__spot {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
  /* per-step metal, overridden per spot below; everything else derives from it */
  --pod-accent: var(--ui-border);
  --pod-medal-fg: var(--ui-text);
  --base-h: 2rem;
}

/* 1st — gold */
.podium__spot--1 {
  --pod-accent: var(--gold);
  --pod-medal-fg: var(--color-sporty-950);
}

/* 2nd — silver */
.podium__spot--2 {
  --pod-accent: var(--silver);
  --pod-medal-fg: var(--ui-bg);
}

/* 3rd — bronze */
.podium__spot--3 {
  --pod-accent: var(--bronze);
  --pod-medal-fg: var(--color-bishop-50);
}

@media (min-width: 40rem) {
  .podium {
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    gap: 1.25rem;
  }

  .podium__spot {
    max-width: 16rem;
  }

  /* visual 2-1-3, winner center */
  .podium__spot--1 {
    order: 2;
    --base-h: 5.5rem;
  }
  .podium__spot--2 {
    order: 1;
    --base-h: 3.5rem;
  }
  .podium__spot--3 {
    order: 3;
    --base-h: 2.25rem;
  }
}

.pod-card {
  position: relative;
  border-radius: 1.25rem;
  border: 1px solid color-mix(in oklch, var(--pod-accent) 65%, var(--ui-border));
  background:
    radial-gradient(130% 90% at 50% 0%, color-mix(in oklch, var(--pod-accent) 32%, transparent), transparent 62%),
    linear-gradient(180deg, color-mix(in oklch, var(--pod-accent) 18%, var(--ui-bg-elevated)), var(--ui-bg-elevated));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}

.pod-card:hover,
.pod-card:focus-within {
  transform: translateY(-6px);
  box-shadow: 0 24px 48px -24px color-mix(in oklch, var(--pod-accent) 55%, transparent);
}

/* soft breathing glow behind the champion */
@media (prefers-reduced-motion: no-preference) {
  .podium__spot--1 .pod-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    box-shadow: 0 0 44px -6px color-mix(in oklch, var(--pod-accent) 55%, transparent);
    animation: champ-glow 3.2s ease-in-out infinite;
  }
}

@keyframes champ-glow {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.85;
  }
}

.pod-card__button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1.25rem 1rem 0.85rem;
  border-radius: inherit;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: center;
}

.pod-card__button:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}

.pod-card__medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in oklch, var(--pod-medal-fg) 20%, transparent);
  background: var(--pod-accent);
  color: var(--pod-medal-fg);
  box-shadow: 0 6px 18px -8px color-mix(in oklch, var(--pod-accent) 80%, transparent);
}

.pod-card__name {
  font-weight: 700;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pod-card__score {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.podium__spot--1 .pod-card__score {
  font-size: 1.85rem;
}

.pod-card__score small {
  margin-left: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}

.pod-card__chev {
  color: var(--ui-text-dimmed);
  transition: rotate 0.3s;
}

.pod-card--open .pod-card__chev {
  rotate: 180deg;
}

/* expandable stats — 0fr → 1fr grid trick, card grows upward (flex-end row) */
.pod-card__more {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.pod-card--open .pod-card__more {
  grid-template-rows: 1fr;
}

.pod-card__more > div {
  overflow: hidden;
  min-height: 0;
}

.pod-card__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 0;
  padding: 0.75rem 1rem 1rem;
  border-top: 1px solid color-mix(in oklch, var(--pod-accent) 40%, transparent);
}

.pod-card__stats div {
  text-align: center;
}

.pod-card__stats dt {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}

.pod-card__stats dd {
  margin: 0.15rem 0 0;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.podium__base {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--base-h);
  margin-top: 0.6rem;
  border-radius: 0.9rem;
  border: 1px solid color-mix(in oklch, var(--pod-accent) 70%, var(--ui-border));
  background: linear-gradient(
    180deg,
    color-mix(in oklch, var(--pod-accent) 85%, var(--ui-bg-elevated)),
    color-mix(in oklch, var(--pod-accent) 55%, var(--ui-bg-elevated))
  );
  transition: height 0.3s;
}

.podium__rank {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pod-medal-fg);
}

@media (prefers-reduced-motion: reduce) {
  .pod-card,
  .pod-card__more,
  .pod-card__chev,
  .podium__base {
    transition: none;
  }
}
</style>
