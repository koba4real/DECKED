<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { insertGameSession } from "~~/lib/db/Schema/game";
import type { FetchError } from "ofetch";

import { endConditionOptions, gameModeOptions, gameSessionSchema } from "~~/lib/db/Schema/game";

const gameStore = useGameStore();
const { users, usersStatus } = storeToRefs(gameStore);
const usersLoading = computed(() => usersStatus.value === "pending");

const form = useTemplateRef("form");
const loading = ref(false);
let submitted = false;

type DraftGameSession = Partial<insertGameSession> & Pick<insertGameSession, "playerIds">;

const state = reactive<DraftGameSession>({
  playerIds: [],
  winnerId: undefined,
  mode: undefined,
  endCondition: undefined,
  scoreAwarded: undefined,
});

// Enrich the schema-derived options with a one-line description for the card radios.
const modeDesc: Record<string, string> = { classic: "Standard scoring", no_mercy: "Higher stakes, louder wins" };
const endDesc: Record<string, string> = { empty_hand: "A player emptied their hand", mercy_rule: "Ended by the mercy rule" };
const modeItems = gameModeOptions.map(o => ({ ...o, description: modeDesc[o.value] }));
const endConditionItems = endConditionOptions.map(o => ({ ...o, description: endDesc[o.value] }));

const selectedPlayers = computed(() => users.value?.filter(u => state.playerIds.includes(u.id)) ?? []);

// Winner must be one of the selected players — drop the pick if they leave the table.
watch(() => state.playerIds, (ids) => {
  if (state.winnerId !== undefined && !ids.includes(state.winnerId))
    state.winnerId = undefined;
});

const toast = useToast();
const { $csrfFetch } = useNuxtApp();

async function onSubmit(event: FormSubmitEvent<insertGameSession>) {
  try {
    loading.value = true;
    submitted = true;
    await $csrfFetch("/api/game/add-game", { method: "POST", body: event.data });
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    await navigateTo("/dashboard/leaderboard");
  }
  catch (err) {
    submitted = false;
    const error = err as FetchError;
    if (error.data?.data)
      form.value?.setErrors(error.data.data);
    toastError("Failed to log game", getFetchErrorMessage(error));
  }
  finally {
    loading.value = false;
  }
}

function resetForm() {
  form.value?.clear();
  state.playerIds = [];
  state.winnerId = undefined;
  state.mode = undefined;
  state.endCondition = undefined;
  state.scoreAwarded = undefined;
}
const showLeaveModal = ref(false);
let leaveTo = "";

onBeforeRouteLeave((to) => {
  if (submitted || !form.value?.dirty)
    return true;
  leaveTo = to.fullPath;
  showLeaveModal.value = true;
  return false;
});

function confirmLeave() {
  submitted = true;
  showLeaveModal.value = false;
  navigateTo(leaveTo);
}
function cancelLeave() {
  showLeaveModal.value = false;
}
</script>

<template>
  <UForm
    ref="form"
    :schema="gameSessionSchema"
    :state="state"
    class="log-form"
    @submit="onSubmit"
  >
    <!-- Players -->
    <section class="field">
      <UFormField name="playerIds">
        <template #label>
          <span class="fld">
            <span class="fld__icon fld__icon--sapphire"><UIcon name="tabler:users-group" class="size-4" /></span>
            <span class="fld__text">Players</span>
            <UBadge
              v-if="state.playerIds.length"
              :label="String(state.playerIds.length)"
              size="sm"
            />
          </span>
        </template>
        <template #description>
          Pick 2–10 players who sat at the table.
        </template>

        <USelectMenu
          v-model="state.playerIds"
          :items="users"
          value-key="id"
          label-key="name"
          multiple
          icon="tabler:user-plus"
          size="lg"
          :loading="usersLoading"
          :disabled="usersLoading"
          :placeholder="usersLoading ? 'Loading players…' : 'Select players'"
          class="w-full"
        />
      </UFormField>

      <!-- Live preview of the roster — winner wears the crown. -->
      <TransitionGroup
        v-if="selectedPlayers.length"
        name="roster"
        tag="div"
        class="roster"
      >
        <span
          v-for="player in selectedPlayers"
          :key="player.id"
          class="roster__chip"
          :class="{ 'roster__chip--winner': player.id === state.winnerId }"
        >
          <UAvatar :alt="player.name" size="xs" />
          <span class="roster__name">{{ player.name }}</span>
          <UIcon
            v-if="player.id === state.winnerId"
            name="tabler:crown"
            class="roster__crown size-3.5"
          />
        </span>
      </TransitionGroup>
    </section>

    <!-- Winner — the spotlight -->
    <section class="field field--winner">
      <UFormField name="winnerId">
        <template #label>
          <span class="fld">
            <span class="fld__icon fld__icon--gold"><UIcon name="tabler:trophy" class="size-4" /></span>
            <span class="fld__text">Winner</span>
          </span>
        </template>
        <template #description>
          {{ state.playerIds.length ? "Crown whoever emptied their hand first." : "Select players first." }}
        </template>

        <USelectMenu
          v-model="state.winnerId"
          :items="selectedPlayers"
          value-key="id"
          label-key="name"
          icon="tabler:crown"
          size="lg"
          :disabled="!state.playerIds.length"
          placeholder="Select winner"
          class="w-full"
        />
      </UFormField>
    </section>

    <!-- Ruleset -->
    <div class="grid gap-5 sm:grid-cols-2">
      <section class="field">
        <UFormField name="mode">
          <template #label>
            <span class="fld">
              <span class="fld__icon fld__icon--mint"><UIcon name="tabler:cards" class="size-4" /></span>
              <span class="fld__text">Game mode</span>
            </span>
          </template>
          <URadioGroup
            v-model="state.mode"
            :items="modeItems"
            variant="card"
            :ui="{ fieldset: 'gap-3' }"
          />
        </UFormField>
      </section>

      <section class="field">
        <UFormField name="endCondition">
          <template #label>
            <span class="fld">
              <span class="fld__icon fld__icon--bishop"><UIcon name="tabler:flag-check" class="size-4" /></span>
              <span class="fld__text">End condition</span>
            </span>
          </template>
          <URadioGroup
            v-model="state.endCondition"
            :items="endConditionItems"
            variant="card"
            :ui="{ fieldset: 'gap-3' }"
          />
        </UFormField>
      </section>
    </div>

    <!-- Score -->
    <section class="field field--score">
      <UFormField name="scoreAwarded">
        <template #label>
          <span class="fld">
            <span class="fld__icon fld__icon--gold"><UIcon name="tabler:coins" class="size-4" /></span>
            <span class="fld__text">Score awarded</span>
          </span>
        </template>
        <template #description>
          Points banked by the winner this round.
        </template>

        <UInputNumber
          v-model="state.scoreAwarded"
          :min="0"
          :max="5000"
          :step="10"
          size="lg"
          placeholder="0"
          class="score-input"
        />
      </UFormField>
    </section>

    <!-- Actions -->
    <div class="actions">
      <UButton
        type="submit"
        size="lg"
        icon="tabler:cards"
        :loading="loading"
      >
        Log game
      </UButton>
      <UButton
        variant="ghost"
        color="neutral"
        size="lg"
        icon="tabler:eraser"
        @click="resetForm"
      >
        Clear
      </UButton>
    </div>
  </UForm>
  <UModal
    v-model:open="showLeaveModal"
    title="Unsaved changes"
    @close="cancelLeave"
  >
    <template #body>
      <p class="point-form__modal-text">
        You have unsaved changes. Leave without saving?
      </p>
    </template>

    <template #footer>
      <div class="point-form__actions">
        <UButton variant="outline" @click="cancelLeave">
          Stay
        </UButton>
        <UButton color="error" @click="confirmLeave">
          Leave
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.log-form {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  width: 100%;
  padding: 1.75rem;
  border-radius: 1.5rem;
  border: 1px solid var(--ui-border);
  background: color-mix(in oklch, var(--ui-bg-elevated) 85%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 32px 70px -34px rgb(0 0 0 / 0.4);
  overflow: hidden;
}

/* Playful UNO stripe across the top of the card. */
.log-form::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--color-bishop-500),
    var(--color-sporty-500),
    var(--color-mint-500),
    var(--color-sapphire-500)
  );
}

@media (min-width: 40rem) {
  .log-form {
    padding: 2.25rem;
    gap: 2rem;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

/* -------------------------------- labels --------------------------------- */

.fld {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.95rem;
  font-weight: 700;
}

.fld__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.6rem;
  border: 1px solid var(--ui-border);
}

.fld__icon--sapphire {
  color: var(--color-sapphire-500);
  background: color-mix(in oklch, var(--color-sapphire-500) 12%, transparent);
  border-color: color-mix(in oklch, var(--color-sapphire-500) 25%, transparent);
}
.fld__icon--mint {
  color: var(--color-mint-600);
  background: color-mix(in oklch, var(--color-mint-500) 12%, transparent);
  border-color: color-mix(in oklch, var(--color-mint-500) 25%, transparent);
}
.fld__icon--bishop {
  color: var(--color-bishop-500);
  background: color-mix(in oklch, var(--color-bishop-500) 12%, transparent);
  border-color: color-mix(in oklch, var(--color-bishop-500) 25%, transparent);
}
.fld__icon--gold {
  color: var(--color-sporty-700);
  background: color-mix(in oklch, var(--color-sporty-500) 20%, transparent);
  border-color: color-mix(in oklch, var(--color-sporty-500) 40%, transparent);
}

/* -------------------------------- roster --------------------------------- */

.roster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.roster__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.75rem 0.3rem 0.3rem;
  border-radius: 9999px;
  border: 1px solid var(--ui-border);
  background: var(--ui-bg);
  font-size: 0.82rem;
  font-weight: 600;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}

.roster__chip--winner {
  border-color: color-mix(in oklch, var(--color-sporty-500) 55%, transparent);
  background: color-mix(in oklch, var(--color-sporty-500) 10%, var(--ui-bg));
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--color-sporty-500) 45%, transparent);
}

.roster__crown {
  color: var(--color-sporty-600);
}

/* enter/leave for the roster chips */
.roster-enter-active,
.roster-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.roster-enter-from,
.roster-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
.roster-leave-active {
  position: absolute;
}

/* -------------------------------- winner --------------------------------- */

.field--winner {
  position: relative;
  padding: 1.25rem;
  border-radius: 1.1rem;
  border: 1px solid color-mix(in oklch, var(--color-sporty-500) 30%, var(--ui-border));
  background:
    radial-gradient(
      120% 140% at 100% 0%,
      color-mix(in oklch, var(--color-sporty-500) 12%, transparent),
      transparent 60%
    ),
    var(--ui-bg);
}

/* ------------------------------- score ----------------------------------- */

.field--score {
  max-width: 16rem;
}

.score-input {
  width: 100%;
}

/* ------------------------------- actions --------------------------------- */

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--ui-border);
}
</style>
