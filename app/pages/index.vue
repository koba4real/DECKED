<script setup lang="ts">
import { motion, MotionConfig } from "motion-v";

// DECKED landing — redesigned from scratch.

/* ---------------------------------- hero --------------------------------- */
type Player = {
  id: number;
  name: string;
  initials: string;
  score: number;
  gradient: string;
};

const players = ref<Player[]>([
  { id: 1, name: "Marta V.", initials: "MV", score: 240, gradient: "linear-gradient(135deg, var(--color-sporty-500), var(--color-bishop-500))" },
  { id: 2, name: "Jordan M.", initials: "JM", score: 215, gradient: "linear-gradient(135deg, var(--color-sapphire-500), var(--color-mint-500))" },
  { id: 3, name: "Luca B.", initials: "LB", score: 185, gradient: "linear-gradient(135deg, var(--color-mint-500), var(--color-sapphire-500))" },
  { id: 4, name: "Sofia R.", initials: "SR", score: 150, gradient: "linear-gradient(135deg, var(--color-bishop-500), var(--color-sporty-500))" },
]);

const standings = computed(() =>
  [...players.value].sort((a, b) => b.score - a.score),
);

const leaderId = computed(() => standings.value[0]?.id);

// A game gets "logged" every few seconds: someone scores, the board reorders.
const scored = ref<{ id: number; pts: number; key: number } | null>(null);
let gameLoop: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;

  gameLoop = setInterval(() => {
    const pool = players.value;
    const winner = pool[Math.floor(Math.random() * pool.length)]!;
    const pts = [10, 20, 20, 40][Math.floor(Math.random() * 4)]!;
    winner.score += pts;
    scored.value = { id: winner.id, pts, key: Date.now() };
  }, 3400);
});

onUnmounted(() => {
  if (gameLoop)
    clearInterval(gameLoop);
});

const floatingCards = [
  { glyph: "+2", class: "float-card--sporty", y: [0, -14, 0], duration: 5 },
  { glyph: "7", class: "float-card--sapphire", y: [0, 12, 0], duration: 6 },
  { glyph: "⇄", class: "float-card--mint float-card--far", y: [0, -10, 0], duration: 7 },
];

/* --------------------------------- ticker -------------------------------- */

const tickerItems = [
  { icon: "tabler:trophy", color: "var(--color-sporty-500)", text: "Marta won · No Mercy · +40 pts" },
  { icon: "tabler:flame", color: "var(--color-sporty-500)", text: "Luca is on a 5-win streak" },
  { icon: "tabler:trending-up", color: "var(--color-mint-500)", text: "Sofia climbed to #1" },
  { icon: "tabler:cards", color: "var(--color-sapphire-500)", text: "Classic · Jordan · empty hand" },
  { icon: "tabler:skull", color: "var(--color-bishop-500)", text: "Mercy rule invoked on Dario" },
  { icon: "tabler:arrows-sort", color: "var(--color-sapphire-500)", text: "Aya overtook Tom in the standings" },
];

/* ------------------------------ how it works ----------------------------- */

const steps = [
  {
    number: "1",
    icon: "tabler:cards",
    title: "Play for real",
    description: "Shuffle up with your friends. Real deck, real table — DECKED stays in your pocket.",
  },
  {
    number: "2",
    icon: "tabler:clipboard-check",
    title: "Log the result",
    description: "Winner, ruleset, and how it ended. One form, ten seconds.",
  },
  {
    number: "3",
    icon: "tabler:trending-up",
    title: "Watch ranks move",
    description: "Score, streak and standing update the moment you save. Cue the group chat.",
  },
];

/* -------------------------------- rivalry -------------------------------- */

const yourForm = ["W", "W", "W", "L", "W"];
const rivalForm = ["L", "W", "L", "W", "L"];
</script>

<template>
  <MotionConfig reduced-motion="user">
    <div class="landing">
      <div class="mesh" aria-hidden="true">
        <span class="mesh__blob mesh__blob--bishop" />
        <span class="mesh__blob mesh__blob--sapphire" />
        <span class="mesh__blob mesh__blob--mint" />
      </div>

      <!-- ================================ HERO ================================ -->
      <UPageHero orientation="horizontal">
        <template #headline>
          <span class="eyebrow">
            <span class="eyebrow__dots" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            The scorekeeper for real-deck UNO
          </span>
        </template>

        <template #title>
          <span class="hero-title">
            Bragging rights,<br>
            made <span class="hl">official.</span>
          </span>
        </template>

        <template #description>
          DECKED doesn't play UNO — your table does. It keeps the score, the
          streaks and the standings, and it never forgets who won.
        </template>

        <template #links>
          <GetStartedButton />
          <UButton
            to="#how-it-works"
            label="See how it works"
            variant="link"
            color="neutral"
            trailing-icon="tabler:chevron-down"
          />
        </template>

        <!-- Live leaderboard stage -->
        <div class="stage">
          <span class="stage__glow" aria-hidden="true" />

          <motion.span
            v-for="card in floatingCards"
            :key="card.glyph"
            class="float-card"
            :class="card.class"
            aria-hidden="true"
            :animate="{ y: card.y }"
            :transition="{ duration: card.duration, repeat: Infinity, ease: 'easeInOut' }"
          >
            {{ card.glyph }}
          </motion.span>

          <motion.div
            class="board"
            :initial="{ opacity: 0, y: 36, scale: 0.96 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{ duration: 0.6, delay: 0.15, ease: 'easeOut' }"
          >
            <div class="board__head">
              <span class="board__label">Season standings</span>
              <span class="board__live">
                <i class="board__dot" aria-hidden="true" />
                Live
              </span>
            </div>

            <motion.div
              v-for="(player, index) in standings"
              :key="player.id"
              :layout="true"
              class="lb__row"
              :class="{ 'lb__row--leader': index === 0 }"
              :transition="{ layout: { type: 'spring', stiffness: 350, damping: 32 } }"
            >
              <span class="lb__rank">{{ index + 1 }}</span>
              <span class="lb__avatar" :style="{ background: player.gradient }">
                {{ player.initials }}
              </span>
              <span class="lb__name">
                {{ player.name }}
                <motion.span
                  v-if="player.id === leaderId"
                  :key="`crown-${leaderId}`"
                  class="lb__crown"
                  :initial="{ scale: 0, rotate: -20 }"
                  :animate="{ scale: 1, rotate: 0 }"
                  :transition="{ type: 'spring', stiffness: 400, damping: 15 }"
                >
                  <UIcon name="tabler:crown" class="size-4" />
                </motion.span>
              </span>
              <span class="lb__score">
                {{ player.score }}
                <motion.span
                  v-if="scored && scored.id === player.id"
                  :key="scored.key"
                  class="lb__delta"
                  :initial="{ opacity: 0, y: 8 }"
                  :animate="{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -10] }"
                  :transition="{ duration: 1.6, times: [0, 0.15, 0.7, 1] }"
                >+{{ scored.pts }}</motion.span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            class="chip chip--streak"
            :initial="{ opacity: 0, y: 12 }"
            :animate="{ opacity: 1, y: [0, -9, 0] }"
            :transition="{ opacity: { duration: 0.5, delay: 0.6 }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }"
          >
            <UIcon name="tabler:flame" class="size-3.5 chip__icon--sporty" />
            3-win streak
          </motion.div>

          <motion.div
            class="chip chip--rank"
            :initial="{ opacity: 0, y: -12 }"
            :animate="{ opacity: 1, y: [0, 9, 0] }"
            :transition="{ opacity: { duration: 0.5, delay: 0.8 }, y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 } }"
          >
            <UIcon name="tabler:trending-up" class="size-3.5 chip__icon--mint" />
            Rank ↑2 this week
          </motion.div>
        </div>
      </UPageHero>

      <!-- =============================== TICKER =============================== -->
      <div class="ticker" aria-hidden="true">
        <div class="ticker__track">
          <div
            v-for="copy in 2"
            :key="copy"
            class="ticker__group"
          >
            <span
              v-for="item in tickerItems"
              :key="`${copy}-${item.text}`"
              class="ticker__item"
            >
              <UIcon
                :name="item.icon"
                class="size-4"
                :style="{ color: item.color }"
              />
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>

      <!-- ============================ HOW IT WORKS ============================ -->
      <UPageSection
        id="how-it-works"
        headline="How it works"
        title="Last card to leaderboard in ten seconds"
        class="scroll-mt-20"
      >
        <template #body>
          <div class="steps">
            <motion.div
              v-for="(step, index) in steps"
              :key="step.number"
              class="step"
              :initial="{ opacity: 0, y: 24 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.4 }"
              :transition="{ duration: 0.5, delay: index * 0.12 }"
            >
              <div class="step__icon">
                <UIcon :name="step.icon" class="size-6" />
                <span class="step__num">{{ step.number }}</span>
              </div>
              <h3 class="step__title">
                {{ step.title }}
              </h3>
              <p class="step__description">
                {{ step.description }}
              </p>
            </motion.div>
          </div>
        </template>
      </UPageSection>

      <!-- =============================== FEATURES ============================= -->
      <UPageSection
        headline="What you keep"
        title="Every game leaves a trail"
        description="Rankings, streaks, rulesets, history. The receipts for every 'that's not how you play'."
      >
        <template #body>
          <div class="bento">
            <!-- Rankings + sparkline -->
            <motion.div
              class="cell cell--wide"
              :initial="{ opacity: 0, y: 24 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.3 }"
              :transition="{ duration: 0.5 }"
              :while-hover="{ y: -4 }"
            >
              <h3 class="cell__title">
                Rankings that remember
              </h3>
              <p class="cell__description">
                Cumulative score across every session and every rematch.
                One lucky night won't save you.
              </p>
              <div class="spark">
                <svg
                  viewBox="0 0 320 96"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="decked-spark"
                      x1="0"
                      y1="0"
                      x2="320"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stop-color="var(--color-sapphire-500)" />
                      <stop offset="1" stop-color="var(--color-mint-500)" />
                    </linearGradient>
                    <linearGradient
                      id="decked-spark-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="96"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset="0"
                        stop-color="var(--color-mint-500)"
                        stop-opacity="0.18"
                      />
                      <stop
                        offset="1"
                        stop-color="var(--color-mint-500)"
                        stop-opacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M4 84 C 40 80, 60 62, 92 60 C 120 58, 138 70, 164 52 C 190 34, 214 44, 240 30 C 264 18, 288 20, 312 10 L 312 92 L 4 92 Z"
                    fill="url(#decked-spark-fill)"
                  />
                  <motion.path
                    d="M4 84 C 40 80, 60 62, 92 60 C 120 58, 138 70, 164 52 C 190 34, 214 44, 240 30 C 264 18, 288 20, 312 10"
                    stroke="url(#decked-spark)"
                    stroke-width="3"
                    stroke-linecap="round"
                    :initial="{ pathLength: 0 }"
                    :while-in-view="{ pathLength: 1 }"
                    :viewport="{ once: true, amount: 0.6 }"
                    :transition="{ duration: 1.4, ease: 'easeOut' }"
                  />
                  <circle
                    cx="312"
                    cy="10"
                    r="5"
                    fill="var(--color-mint-500)"
                    class="spark__dot"
                  />
                </svg>
              </div>
            </motion.div>

            <!-- Streaks -->
            <motion.div
              class="cell"
              :initial="{ opacity: 0, y: 24 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.3 }"
              :transition="{ duration: 0.5, delay: 0.08 }"
              :while-hover="{ y: -4 }"
            >
              <div class="pips">
                <UIcon name="tabler:flame" class="size-5 pips__flame" />
                <span class="pip pip--l">L</span>
                <span class="pip pip--w">W</span>
                <span class="pip pip--w">W</span>
                <span class="pip pip--w">W</span>
                <span class="pip pip--w pip--hot">W</span>
              </div>
              <h3 class="cell__title">
                Streaks, tracked
              </h3>
              <p class="cell__description">
                Win streaks earn the flame. Losing ones are, unfortunately, also on record.
              </p>
            </motion.div>

            <!-- Modes -->
            <motion.div
              class="cell"
              :initial="{ opacity: 0, y: 24 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.3 }"
              :transition="{ duration: 0.5, delay: 0.05 }"
              :while-hover="{ y: -4 }"
            >
              <div class="modes">
                <span class="mode">
                  <UIcon name="tabler:cards" class="size-4 mode__icon--sapphire" />
                  <span>
                    <b>Classic</b>
                    <small>Standard scoring</small>
                  </span>
                </span>
                <span class="mode">
                  <UIcon name="tabler:skull" class="size-4 mode__icon--sporty" />
                  <span>
                    <b>No Mercy</b>
                    <small>Higher stakes, louder wins</small>
                  </span>
                </span>
              </div>
              <h3 class="cell__title">
                Both rulesets, logged
              </h3>
              <p class="cell__description">
                Mode and end condition on every game — empty hand or mercy rule.
              </p>
            </motion.div>

            <!-- Fast logging -->
            <motion.div
              class="cell"
              :initial="{ opacity: 0, y: 24 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.3 }"
              :transition="{ duration: 0.5, delay: 0.1 }"
              :while-hover="{ y: -4 }"
            >
              <div class="logrow">
                <span class="logrow__check">
                  <UIcon name="tabler:check" class="size-3.5" />
                </span>
                <span class="logrow__text">Jordan · No Mercy · Empty hand</span>
                <span class="logrow__time">
                  <UIcon name="tabler:stopwatch" class="size-3" />
                  9s
                </span>
              </div>
              <h3 class="cell__title">
                Ten-second logging
              </h3>
              <p class="cell__description">
                Winner, mode, end condition — saved before the deck's back in the box.
              </p>
            </motion.div>

            <!-- Sign-in -->
            <motion.div
              class="cell"
              :initial="{ opacity: 0, y: 24 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.3 }"
              :transition="{ duration: 0.5, delay: 0.15 }"
              :while-hover="{ y: -4 }"
            >
              <div class="providers">
                <span class="provider"><UIcon name="tabler:brand-github" class="size-5" /></span>
                <span class="provider"><UIcon name="tabler:brand-google" class="size-5" /></span>
              </div>
              <h3 class="cell__title">
                No new passwords
              </h3>
              <p class="cell__description">
                GitHub or Google. You're at the table in one tap.
              </p>
            </motion.div>
          </div>
        </template>
      </UPageSection>

      <!-- =============================== RIVALRY ============================== -->
      <UPageSection
        headline="Head-to-head"
        title="Settle the group chat"
        description="For every 'that win didn't count' — the record says otherwise."
      >
        <template #body>
          <motion.div
            class="duel"
            :initial="{ opacity: 0, y: 32 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true, amount: 0.3 }"
            :transition="{ duration: 0.6 }"
          >
            <div class="duel__grid">
              <div class="duel__player">
                <span class="duel__avatar duel__avatar--you">YOU</span>
                <span class="duel__name">You</span>
                <span class="duel__wins">18<small>wins</small></span>
                <span class="duel__form">
                  <span
                    v-for="(r, i) in yourForm"
                    :key="i"
                    class="pip pip--sm"
                    :class="r === 'W' ? 'pip--w' : 'pip--l'"
                  >{{ r }}</span>
                </span>
              </div>

              <div class="duel__center">
                <span class="duel__vs">VS</span>
                <span class="duel__games">29 games</span>
              </div>

              <div class="duel__player">
                <span class="duel__avatar duel__avatar--rival">AX</span>
                <span class="duel__name">Alex</span>
                <span class="duel__wins">11<small>wins</small></span>
                <span class="duel__form">
                  <span
                    v-for="(r, i) in rivalForm"
                    :key="i"
                    class="pip pip--sm"
                    :class="r === 'W' ? 'pip--w' : 'pip--l'"
                  >{{ r }}</span>
                </span>
              </div>
            </div>

            <div class="duel__bar">
              <motion.span
                class="duel__bar-fill"
                :initial="{ width: '0%' }"
                :while-in-view="{ width: '62%' }"
                :viewport="{ once: true, amount: 0.8 }"
                :transition="{ duration: 1, ease: 'easeOut', delay: 0.2 }"
              />
            </div>
            <div class="duel__pct">
              <span>You · 62% win rate</span>
              <span>Alex · 38%</span>
            </div>

            <div class="duel__foot">
              <span class="chip chip--static">
                <UIcon name="tabler:flame" class="size-3.5 chip__icon--sporty" />
                Longest streak: yours — 6 wins
              </span>
            </div>
          </motion.div>
        </template>
      </UPageSection>

      <!-- ================================= CTA ================================ -->
      <div class="cta-wrap">
        <div class="cta-fan" aria-hidden="true">
          <span class="float-card float-card--fan float-card--sporty">+2</span>
          <span class="float-card float-card--fan float-card--sapphire">7</span>
          <span class="float-card float-card--fan float-card--mint">⇄</span>
          <span class="float-card float-card--fan float-card--bishop">∅</span>
        </div>

        <UPageCTA
          title="Deal the cards. We'll keep the receipts."
          description="Sign in with GitHub or Google and log your first game in under a minute."
        >
          <template #links>
            <GetStartedButton />
          </template>
        </UPageCTA>
      </div>
    </div>
  </MotionConfig>
</template>

<style scoped>
.landing {
  position: relative;
  isolation: isolate;
  overflow-x: clip;
}

/* ------------------------------- background ------------------------------ */

.mesh {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.mesh__blob {
  position: absolute;
  width: 30rem;
  height: 30rem;
  border-radius: 9999px;
  filter: blur(120px);
  opacity: 0.18;
  animation: drift 20s ease-in-out infinite;
}

.mesh__blob--bishop {
  top: -4rem;
  left: -8rem;
  background: var(--color-bishop-500);
}

.mesh__blob--sapphire {
  top: 8%;
  right: -10rem;
  background: var(--color-sapphire-500);
  animation-delay: -7s;
}

.mesh__blob--mint {
  top: 55%;
  left: 20%;
  background: var(--color-mint-500);
  animation-delay: -13s;
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(2.5rem, -2rem) scale(1.07);
  }
}

/* --------------------------------- eyebrow -------------------------------- */

/* ---------------------------------- title -------------------------------- */

.hero-title {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.06;
  text-wrap: balance;
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

@media (max-width: 26rem) {
  .hero-title {
    font-size: 2.35rem;
  }
}

/* ---------------------------------- stage --------------------------------- */

.stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 23rem;
  margin-top: 1.5rem;
}

@media (min-width: 40rem) {
  .stage {
    min-height: 26rem;
    margin-top: 0;
  }
}

.stage__glow {
  position: absolute;
  width: 18rem;
  height: 18rem;
  border-radius: 9999px;
  background: radial-gradient(circle, color-mix(in oklch, var(--color-sapphire-500) 30%, transparent), transparent 70%);
  filter: blur(50px);
  pointer-events: none;
}

@media (min-width: 40rem) {
  .stage__glow {
    width: 24rem;
    height: 24rem;
  }
}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 4.9rem;
  border-radius: 0.9rem;
  border: 3px solid rgb(255 255 255 / 0.85);
  color: white;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.15rem;
  box-shadow: 0 24px 44px -18px rgb(0 0 0 / 0.45);
  pointer-events: none;
}

@media (min-width: 40rem) {
  .float-card {
    width: 4.2rem;
    height: 6rem;
    font-size: 1.4rem;
  }
}

.float-card--sporty {
  background: var(--color-sporty-500);
}
.float-card--sapphire {
  background: var(--color-sapphire-500);
}
.float-card--mint {
  background: var(--color-mint-500);
}
.float-card--bishop {
  background: var(--color-bishop-500);
}

.stage .float-card--sporty {
  top: 2%;
  right: 0;
  rotate: 12deg;
}

.stage .float-card--sapphire {
  bottom: 6%;
  left: 0;
  rotate: -10deg;
}

.stage .float-card--mint {
  top: 14%;
  left: 5%;
  rotate: -18deg;
}

@media (min-width: 40rem) {
  .stage .float-card--sporty {
    top: 4%;
    right: 6%;
  }

  .stage .float-card--sapphire {
    bottom: 10%;
    left: 2%;
  }

  .stage .float-card--mint {
    top: 16%;
    left: 12%;
  }
}

.float-card--far {
  width: 2.6rem;
  height: 3.8rem;
  font-size: 0.9rem;
  filter: blur(2.5px);
  opacity: 0.65;
}

@media (min-width: 40rem) {
  .float-card--far {
    width: 3.2rem;
    height: 4.6rem;
    font-size: 1.05rem;
  }
}

/* ---------------------------------- board --------------------------------- */

.board {
  position: relative;
  z-index: 1;
  width: min(22rem, 100%);
  padding: 0.9rem;
  border-radius: 1.25rem;
  border: 1px solid var(--ui-border);
  background: color-mix(in oklch, var(--ui-bg-elevated) 82%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 32px 70px -28px rgb(0 0 0 / 0.45);
}

@media (min-width: 40rem) {
  .board {
    padding: 1.1rem;
  }
}

.board__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  margin-bottom: 0.75rem;
}

.board__label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}

.board__live {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-mint-600);
}

.board__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background: var(--color-mint-500);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in oklch, var(--color-mint-500) 45%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px transparent;
  }
}

.lb__row {
  display: grid;
  grid-template-columns: 1.1rem 2.4rem 1fr auto;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.5rem;
  border-radius: 0.8rem;
}

.lb__row--leader {
  background: color-mix(in oklch, var(--ui-primary) 8%, transparent);
}

.lb__rank {
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-muted);
  text-align: center;
}

.lb__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 9999px;
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
}

.lb__name {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 0;
}

.lb__crown {
  display: inline-flex;
  color: var(--color-sporty-500);
}

.lb__score {
  position: relative;
  font-size: 1rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.lb__delta {
  position: absolute;
  right: 0;
  top: -1.15rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-mint-600);
  white-space: nowrap;
}

/* ---------------------------------- chips --------------------------------- */

.chip {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--ui-border);
  background: var(--ui-bg-elevated);
  box-shadow: 0 10px 25px -12px rgb(0 0 0 / 0.35);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.chip--streak {
  top: 0.25rem;
  right: 0;
}

.chip--rank {
  bottom: 0.5rem;
  left: 0;
}

@media (min-width: 40rem) {
  .chip--streak {
    top: 1rem;
    right: 0.5rem;
  }

  .chip--rank {
    bottom: 1.5rem;
  }
}

.chip--static {
  position: static;
  box-shadow: none;
  white-space: normal;
  text-align: center;
}

.chip__icon--sporty {
  color: var(--color-sporty-500);
}

.chip__icon--mint {
  color: var(--color-mint-500);
}

/* --------------------------------- ticker --------------------------------- */

.ticker {
  overflow: hidden;
  padding: 0.85rem 0;
  border-block: 1px solid var(--ui-border);
  mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
}

.ticker__track {
  display: flex;
  width: max-content;
  animation: ticker 34s linear infinite;
}

.ticker__group {
  display: flex;
  gap: 3rem;
  padding-right: 3rem;
}

.ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--ui-text-muted);
  white-space: nowrap;
}

@keyframes ticker {
  to {
    transform: translateX(-50%);
  }
}

/* ---------------------------------- steps --------------------------------- */

.steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2.5rem;
}

@media (min-width: 40rem) {
  .steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .steps::before {
    content: "";
    position: absolute;
    top: 1.45rem;
    left: 8%;
    right: 8%;
    border-top: 2px dashed var(--ui-border);
  }
}

.step {
  position: relative;
}

.step__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.9rem;
  height: 2.9rem;
  border-radius: 0.9rem;
  background: color-mix(in oklch, var(--ui-primary) 12%, var(--ui-bg));
  border: 1px solid color-mix(in oklch, var(--ui-primary) 25%, transparent);
  color: var(--ui-primary);
}

.step__num {
  position: absolute;
  top: -0.45rem;
  right: -0.45rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 9999px;
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--ui-text-muted);
}

.step__title {
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 700;
}

.step__description {
  margin-top: 0.25rem;
  color: var(--ui-text-muted);
}

/* ---------------------------------- bento --------------------------------- */

.bento {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 40rem) {
  .bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cell--wide {
    grid-column: span 2;
  }
}

@media (min-width: 64rem) {
  .bento {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .cell--wide {
    grid-column: span 4;
  }

  .cell:not(.cell--wide) {
    grid-column: span 2;
  }
}

.cell {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 1.1rem;
  border: 1px solid var(--ui-border);
  background: var(--ui-bg-elevated);
}

.cell__title {
  font-size: 1.05rem;
  font-weight: 700;
}

.cell__description {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--ui-text-muted);
}

.cell--wide .cell__title {
  font-size: 1.2rem;
}

.spark {
  margin-top: auto;
  padding-top: 1.5rem;
}

.spark svg {
  display: block;
  width: 100%;
  height: 6rem;
}

.spark__dot {
  animation: pulse 2s ease-in-out infinite;
}

/* streak pips */

.pips {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.pips__flame {
  color: var(--color-sporty-500);
  margin-right: 0.15rem;
}

.pip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.5rem;
  font-size: 0.68rem;
  font-weight: 800;
}

.pip--sm {
  width: 1.3rem;
  height: 1.3rem;
  font-size: 0.6rem;
  border-radius: 0.4rem;
}

.pip--w {
  background: color-mix(in oklch, var(--color-mint-500) 16%, transparent);
  color: var(--color-mint-600);
}

.pip--l {
  background: color-mix(in oklch, var(--color-sporty-500) 12%, transparent);
  color: var(--color-sporty-600);
}

.pip--hot {
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--color-mint-500) 45%, transparent);
}

/* modes */

.modes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mode {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.7rem;
  border-radius: 0.7rem;
  border: 1px solid var(--ui-border);
}

.mode span {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.mode b {
  font-size: 0.8rem;
  font-weight: 700;
}

.mode small {
  font-size: 0.7rem;
  color: var(--ui-text-muted);
}

.mode__icon--sapphire {
  color: var(--color-sapphire-500);
}

.mode__icon--sporty {
  color: var(--color-sporty-500);
}

/* log row */

.logrow {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.7rem;
  margin-bottom: 1rem;
  border-radius: 0.7rem;
  border: 1px solid var(--ui-border);
  font-size: 0.75rem;
  font-weight: 600;
}

.logrow__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 9999px;
  background: color-mix(in oklch, var(--color-mint-500) 18%, transparent);
  color: var(--color-mint-600);
  flex-shrink: 0;
}

.logrow__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logrow__time {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: auto;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  background: color-mix(in oklch, var(--ui-primary) 10%, transparent);
  color: var(--ui-primary);
  font-size: 0.68rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* providers */

.providers {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.provider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.8rem;
  border: 1px solid var(--ui-border);
  color: var(--ui-text-muted);
}

/* ---------------------------------- duel ---------------------------------- */

.duel {
  max-width: 46rem;
  margin-inline: auto;
  padding: 1.25rem;
  border-radius: 1.4rem;
  border: 1px solid var(--ui-border);
  background: var(--ui-bg-elevated);
  box-shadow: 0 28px 60px -30px rgb(0 0 0 / 0.4);
}

.duel__grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  align-items: center;
}

@media (min-width: 40rem) {
  .duel {
    padding: 2rem;
  }

  .duel__grid {
    gap: 1rem;
  }
}

.duel__player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
}

.duel__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  color: white;
  font-weight: 800;
  font-size: 0.7rem;
}

@media (min-width: 40rem) {
  .duel__avatar {
    width: 3.4rem;
    height: 3.4rem;
    font-size: 0.8rem;
  }
}

.duel__avatar--you {
  background: linear-gradient(135deg, var(--color-sapphire-500), var(--color-mint-500));
}

.duel__avatar--rival {
  background: linear-gradient(135deg, var(--color-sporty-500), var(--color-bishop-500));
}

.duel__name {
  font-weight: 700;
  font-size: 0.9rem;
}

.duel__wins {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1;
}

@media (min-width: 40rem) {
  .duel__wins {
    font-size: 2rem;
  }
}

.duel__wins small {
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}

.duel__form {
  display: flex;
  gap: 0.3rem;
  margin-top: 0.2rem;
}

.duel__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.duel__vs {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--ui-text-muted);
}

@media (min-width: 40rem) {
  .duel__vs {
    font-size: 1.6rem;
  }
}

.duel__games {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}

.duel__bar {
  height: 0.8rem;
  margin-top: 1.75rem;
  border-radius: 9999px;
  background: color-mix(in oklch, var(--color-sporty-500) 22%, transparent);
  overflow: hidden;
}

.duel__bar-fill {
  display: block;
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--color-sapphire-500), var(--color-mint-500));
}

.duel__pct {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}

.duel__foot {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

/* ----------------------------------- CTA ---------------------------------- */

.cta-wrap {
  position: relative;
  margin-top: 3rem;
}

.cta-fan {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -45%);
  display: flex;
  z-index: 1;
  pointer-events: none;
}

.float-card--fan {
  position: relative;
  width: 2.6rem;
  height: 3.7rem;
  margin: 0 -0.55rem;
  font-size: 0.9rem;
  border-width: 2px;
}

@media (min-width: 40rem) {
  .float-card--fan {
    width: 3rem;
    height: 4.3rem;
    margin: 0 -0.6rem;
    font-size: 1rem;
  }
}

.float-card--fan:nth-child(1) {
  rotate: -16deg;
  translate: 0 0.5rem;
}
.float-card--fan:nth-child(2) {
  rotate: -5deg;
}
.float-card--fan:nth-child(3) {
  rotate: 5deg;
}
.float-card--fan:nth-child(4) {
  rotate: 16deg;
  translate: 0 0.5rem;
}

/* ------------------------------ reduced motion ----------------------------- */

@media (prefers-reduced-motion: reduce) {
  .mesh__blob,
  .ticker__track,
  .board__dot,
  .spark__dot {
    animation: none;
  }
}
</style>
