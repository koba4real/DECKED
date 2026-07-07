<script lang="ts" setup>
import { motion } from "motion-v";

defineProps<{ players: RankedPlayer[] }>();

// Medal tint for a table row, keyed by rank (ties can share a medal).
const rankTone = ["", "row--gold", "row--silver", "row--bronze"];
</script>

<template>
  <!-- Full table: everyone, rank 1 down — the podium is just the showcase. -->
  <section class="ranks-wrap">
    <h2 class="ranks-wrap__title">
      Full standings
    </h2>
    <ol class="ranks">
      <motion.li
        v-for="(p, i) in players"
        :key="p.id"
        class="row"
        :class="rankTone[p.rank]"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.45 + Math.min(i, 10) * 0.05 }"
      >
        <span class="row__rank">#{{ p.rank }}</span>
        <UAvatar
          :src="p.image ?? undefined"
          :alt="p.name"
          size="md"
        />
        <span class="row__who">
          <span class="row__name">{{ p.name }}</span>
          <span class="row__sub">{{ p.gamesPlayed }} {{ p.gamesPlayed === 1 ? "game" : "games" }} · {{ p.winRate }}% win</span>
        </span>
        <span class="row__wl">
          <UBadge
            :label="`${p.wins}W`"
            color="success"
            variant="soft"
            size="sm"
          />
          <UBadge
            :label="`${p.losses}L`"
            color="error"
            variant="soft"
            size="sm"
          />
        </span>
        <span class="row__rate">
          <UProgress
            :model-value="p.winRate"
            :max="100"
            size="sm"
            class="row__bar"
          />
          <span class="row__pct">{{ p.winRate }}%</span>
        </span>
        <span class="row__score">{{ p.totalScore.toLocaleString() }}</span>
      </motion.li>
    </ol>
  </section>
</template>

<style scoped>
.ranks-wrap {
  margin-top: 2.5rem;
  /* medal metals, derived from the UNO palette */
  --gold: var(--color-sporty-500);
  --silver: color-mix(in oklch, var(--ui-text-muted) 60%, var(--ui-bg-elevated));
  --bronze: color-mix(in oklch, var(--color-bishop-500) 55%, var(--color-sporty-600));
}

.ranks-wrap__title {
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}

.ranks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: grid;
  grid-template-columns: 2.4rem auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--ui-border);
  border-radius: 1rem;
  background: color-mix(in oklch, var(--ui-bg-elevated) 75%, transparent);
  transition:
    border-color 0.2s,
    background 0.2s;
}

.row:hover {
  border-color: color-mix(in oklch, var(--color-sapphire-500) 35%, var(--ui-border));
  background: color-mix(in oklch, var(--color-sapphire-500) 5%, var(--ui-bg-elevated));
}

/* medal tint for the top-3 rows in the table */
.row--gold {
  --row-accent: var(--gold);
}
.row--silver {
  --row-accent: var(--silver);
}
.row--bronze {
  --row-accent: var(--bronze);
}

.row--gold,
.row--silver,
.row--bronze {
  border-color: color-mix(in oklch, var(--row-accent) 60%, var(--ui-border));
  background: linear-gradient(
    90deg,
    color-mix(in oklch, var(--row-accent) 18%, var(--ui-bg-elevated)),
    color-mix(in oklch, var(--ui-bg-elevated) 75%, transparent) 55%
  );
}

.row--gold .row__rank,
.row--silver .row__rank,
.row--bronze .row__rank {
  color: color-mix(in oklch, var(--row-accent) 60%, var(--ui-text));
  font-weight: 800;
}

.row__rank {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-muted);
}

.row__who {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.row__name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row__sub {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}

.row__wl {
  display: none;
}

.row__rate {
  display: none;
}

.row__score {
  justify-self: end;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@media (min-width: 48rem) {
  .row {
    grid-template-columns: 2.4rem auto minmax(0, 1fr) auto minmax(8rem, 11rem) 4.5rem;
  }

  .row__wl {
    display: inline-flex;
    gap: 0.35rem;
  }

  .row__rate {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .row__bar {
    flex: 1;
  }

  .row__pct {
    font-size: 0.75rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--ui-text-muted);
    min-width: 2.2rem;
    text-align: right;
  }

  .row__sub {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .row {
    transition: none;
  }
}
</style>
