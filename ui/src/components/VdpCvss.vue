<template>
  <q-field
    borderless
    hide-bottom-space
  >
    <div class="vdp-cvss">
      <div class="grid">
        <div class="radio-groups q-gutter-md">
          <vdp-radio-group
            v-for="(def, name) in CVSSDefinition"
            :ref="
              (radioGroup) => {
                radioGroups[name] = radioGroup;
              }
            "
            :key="def.label"
            v-model="model[name]"
            v-bind="$attrs"
            :hint="name"
            :label="def.label"
            required
            :required-label="fieldRequiredLabel"
            :choices="def.choices"
          />
        </div>
        <vdp-cvss-result
          :score-label="scoreLabel"
          :score="score"
          :severity-label="severityLabel"
          :severity="severity"
          class="result"
        />
      </div>
    </div>
  </q-field>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useFormChild } from 'quasar';
import VdpCvssResult from './VdpCvssResult.vue';
import VdpRadioGroup from './VdpRadioGroup.vue';
import cvss from 'cvss';

interface Props {
  modelValue: Record<string, string>;
  fieldRequiredLabel?: string;
  scoreLabel?: string;
  severityLabel?: string;
  attackVectorLabel?: string;
  userInteractionLabel?: string;
  attackComplexityLabel?: string;
  confidentialityLabel?: string;
  privilegesRequiredLabel?: string;
  integrityLabel?: string;
  scopeLabel?: string;
  availabilityLabel?: string;
  networkLabel?: string;
  adjacentLabel?: string;
  localLabel?: string;
  physicalLabel?: string;
  noneLabel?: string;
  lowLabel?: string;
  highLabel?: string;
  requiredLabel?: string;
  changedLabel?: string;
  unchangedLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  scoreLabel: undefined,
  fieldRequiredLabel: undefined,
  severityLabel: undefined,
  attackVectorLabel: 'Attack Vector',
  userInteractionLabel: 'User Interaction',
  attackComplexityLabel: 'Attack Complexity',
  confidentialityLabel: 'Confidentiality',
  privilegesRequiredLabel: 'Privileges Required',
  integrityLabel: 'Integrity',
  scopeLabel: 'Scope',
  availabilityLabel: 'Availability',
  networkLabel: 'Network',
  adjacentLabel: 'Adjacent',
  localLabel: 'Local',
  physicalLabel: 'Physical',
  noneLabel: 'None',
  lowLabel: 'Low',
  highLabel: 'High',
  requiredLabel: 'Required',
  changedLabel: 'Changed',
  unchangedLabel: 'Unchanged',
});
const emit = defineEmits(['update:modelValue']);
const model = computed({
  get() {
    return props.modelValue;
  },
  set(v: Record<string, string>) {
    emit('update:modelValue', v);
  },
});

type VdpRadioGroupInstanceType = InstanceType<typeof VdpRadioGroup>;
const radioGroups = ref<{ [key: string]: VdpRadioGroupInstanceType }>({});
useFormChild({
  validate: () =>
    Promise.resolve(
      Object.values(radioGroups.value)
        .map((radioGroup) => (radioGroup.validate() as boolean | Promise<boolean> | undefined) || false)
        .every((validated) => validated)
    ),
  resetValidation: () =>
    Object.values(radioGroups.value).forEach((radioGroup) => radioGroup.resetValidation() as void | undefined),
});

const CVSSDefinition = computed(() => ({
  AV: {
    label: props.attackVectorLabel,
    choices: [
      {
        label: props.networkLabel,
        value: 'N',
      },
      {
        label: props.adjacentLabel,
        value: 'A',
      },
      {
        label: props.localLabel,
        value: 'L',
      },
      {
        label: props.physicalLabel,
        value: 'P',
      },
    ],
  },
  UI: {
    label: props.userInteractionLabel,
    choices: [
      {
        label: props.noneLabel,
        value: 'N',
      },
      {
        label: props.requiredLabel,
        value: 'R',
      },
    ],
  },
  AC: {
    label: props.attackComplexityLabel,
    choices: [
      {
        label: props.lowLabel,
        value: 'L',
      },
      {
        label: props.highLabel,
        value: 'H',
      },
    ],
  },
  C: {
    label: props.confidentialityLabel,
    choices: [
      {
        label: props.noneLabel,
        value: 'N',
      },
      {
        label: props.lowLabel,
        value: 'L',
      },
      {
        label: props.highLabel,
        value: 'H',
      },
    ],
  },
  PR: {
    label: props.privilegesRequiredLabel,
    choices: [
      {
        label: props.noneLabel,
        value: 'N',
      },
      {
        label: props.lowLabel,
        value: 'L',
      },
      {
        label: props.highLabel,
        value: 'H',
      },
    ],
  },
  I: {
    label: props.integrityLabel,
    choices: [
      {
        label: props.noneLabel,
        value: 'N',
      },
      {
        label: props.lowLabel,
        value: 'L',
      },
      {
        label: props.highLabel,
        value: 'H',
      },
    ],
  },
  S: {
    label: props.scopeLabel,
    choices: [
      {
        label: props.unchangedLabel,
        value: 'U',
      },
      {
        label: props.changedLabel,
        value: 'C',
      },
    ],
  },
  A: {
    label: props.availabilityLabel,
    choices: [
      {
        label: props.noneLabel,
        value: 'N',
      },
      {
        label: props.lowLabel,
        value: 'L',
      },
      {
        label: props.highLabel,
        value: 'H',
      },
    ],
  },
}));

const score = computed(() => cvss.getScore(model.value));
const severity = computed(() => cvss.getRating(score.value));
</script>

<style lang="scss" scoped>
@import 'quasar/src/css/variables.sass';
.vdp-cvss {
  width: 100%;
  display: flex;
  flex-direction: column;
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: $breakpoint-sm-max) {
      grid-template-columns: 1fr auto;
    }
    justify-content: center;
    align-content: center;
    gap: 2em;
    padding: 1em;
    .radio-groups {
      display: grid;
      grid-template-columns: auto;

      justify-items: left;
      @media screen and (min-width: $breakpoint-xs-max) {
        grid-template-columns: auto auto;
      }
      align-content: center;
      justify-content: start;
      align-items: center;
      gap: 1em;
      column-gap: 5em;
    }
  }
}
</style>
