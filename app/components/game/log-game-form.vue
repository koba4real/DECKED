<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { insertGameSession } from "~~/lib/db/Schema/game";

import { endConditionOptions, gameModeOptions, gameSessionSchema } from "~~/lib/db/Schema/game";
import { reactive, useTemplateRef } from "vue";

const users = [
  { id: 1, name: "Okba" },
  { id: 2, name: "Marco" },
  { id: 3, name: "Giulia" },
];
const loading = false;

const form = useTemplateRef("form");

type DraftGameSession = Partial<insertGameSession> & Pick<insertGameSession, "playerIds">;

const state = reactive<DraftGameSession>({
  playerIds: [],
  winnerId: undefined,
  mode: undefined,
  endCondition: undefined,
  scoreAwarded: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<insertGameSession>) {
  toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
  console.log("Form submitted:", event.data);
}

function resetForm() {
  form.value?.clear();
  state.playerIds = [];
  state.winnerId = undefined;
  state.mode = undefined;
  state.endCondition = undefined;
  state.scoreAwarded = undefined;
}
</script>

<template>
  <div class="point-form-container">
    <UForm
      ref="form"
      :schema="gameSessionSchema"
      :state="state"
      class="w-full"
      @submit="onSubmit"
    >
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UFormField
          label="Players"
          name="playerIds"
          description="Select 2-10 players"
        >
          <USelectMenu
            v-model="state.playerIds"
            :items="users"
            value-key="id"
            label-key="name"
            multiple
            :disabled="loading"
            placeholder="Select players"
            @update:model-value="(ids: number[]) => { const { winnerId } = state; if (winnerId !== undefined && !ids.includes(winnerId)) state.winnerId = undefined }"
          />
        </UFormField>
        <UFormField label="Winner" name="winnerId">
          <UTooltip text="Select players first" :disabled="!!state.playerIds.length">
            <span class="block">
              <USelectMenu
                v-model="state.winnerId"
                :items="users.filter(u => state.playerIds.includes(u.id))"
                value-key="id"
                label-key="name"
                :disabled="loading || !state.playerIds.length"
                placeholder="Select winner"
                class="w-full"
              />
            </span>
          </UTooltip>
        </UFormField>
        <UFormField label="Game mode" name="mode">
          <URadioGroup
            v-model="state.mode"
            :items="gameModeOptions"
            :disabled="loading"
          />
        </UFormField>
        <UFormField label="End condition" name="endCondition">
          <URadioGroup
            v-model="state.endCondition"
            :items="endConditionOptions"
            :disabled="loading"
          />
        </UFormField>
        <UFormField label="Score" name="scoreAwarded">
          <UInputNumber
            v-model="state.scoreAwarded"
            :disabled="loading"
          />
        </UFormField>
        <div class="flex gap-2 mt-8">
          <UButton type="submit">
            Submit
          </UButton>

          <UButton variant="outline" @click="resetForm">
            Clear
          </UButton>
        </div>
      </div>
    </UForm>
  </div>
</template>
