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
          :score-title="cardScoreTitle"
          :score="score"
          :severity-title="cardSeverityTitle"
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
  cardScoreTitle?: string;
  cardSeverityTitle?: string;

  attackVectorLabel?: string;
  userInteractionLabel?: string;
  attackComplexityLabel?: string;
  confidentialityLabel?: string;
  privilegesRequiredLabel?: string;
  integrityLabel?: string;
  scopeLabel?: string;
  availabilityLabel?: string;

  avNetworkLabel?: string;
  avAdjacentLabel?: string;
  avLocalLabel?: string;
  avPhysicalLabel?: string;

  uiNoneLabel?: string;
  uiRequiredLabel?: string;

  acLowLabel?: string;
  acHighLabel?: string;

  cNoneLabel?: string;
  cLowLabel?: string;
  cHighLabel?: string;

  prNoneLabel?: string;
  prLowLabel?: string;
  prHighLabel?: string;

  iNoneLabel?: string;
  iLowLabel?: string;
  iHighLabel?: string;

  sUnchangedLabel?: string;
  sChangedLabel?: string;

  aNoneLabel?: string;
  aLowLabel?: string;
  aHighLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  cardScoreTitle: undefined,
  cardSeverityTitle: undefined,
  fieldRequiredLabel: undefined,

  attackVectorLabel: 'Attack Vector',
  userInteractionLabel: 'User Interaction',
  attackComplexityLabel: 'Attack Complexity',
  confidentialityLabel: 'Confidentiality',
  privilegesRequiredLabel: 'Privileges Required',
  integrityLabel: 'Integrity',
  scopeLabel: 'Scope',
  availabilityLabel: 'Availability',

  avNetworkLabel: 'Network',
  avAdjacentLabel: 'Adjacent',
  avLocalLabel: 'Local',
  avPhysicalLabel: 'Physical',

  uiNoneLabel: 'None',
  uiRequiredLabel: 'Required',

  acLowLabel: 'Low',
  acHighLabel: 'High',

  cNoneLabel: 'None',
  cLowLabel: 'Low',
  cHighLabel: 'High',

  prNoneLabel: 'None',
  prLowLabel: 'Low',
  prHighLabel: 'High',

  iNoneLabel: 'None',
  iLowLabel: 'Low',
  iHighLabel: 'High',

  sUnchangedLabel: 'Unchanged',
  sChangedLabel: 'Changed',

  aNoneLabel: 'None',
  aLowLabel: 'Low',
  aHighLabel: 'High',
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
        label: props.avNetworkLabel,
        value: 'N',
      },
      {
        label: props.avAdjacentLabel,
        value: 'A',
      },
      {
        label: props.avLocalLabel,
        value: 'L',
      },
      {
        label: props.avPhysicalLabel,
        value: 'P',
      },
    ],
  },
  UI: {
    label: props.userInteractionLabel,
    choices: [
      {
        label: props.uiNoneLabel,
        value: 'N',
      },
      {
        label: props.uiRequiredLabel,
        value: 'R',
      },
    ],
  },
  AC: {
    label: props.attackComplexityLabel,
    choices: [
      {
        label: props.acLowLabel,
        value: 'L',
      },
      {
        label: props.acHighLabel,
        value: 'H',
      },
    ],
  },
  C: {
    label: props.confidentialityLabel,
    choices: [
      {
        label: props.cNoneLabel,
        value: 'N',
      },
      {
        label: props.cLowLabel,
        value: 'L',
      },
      {
        label: props.cHighLabel,
        value: 'H',
      },
    ],
  },
  PR: {
    label: props.privilegesRequiredLabel,
    choices: [
      {
        label: props.prNoneLabel,
        value: 'N',
      },
      {
        label: props.prLowLabel,
        value: 'L',
      },
      {
        label: props.prHighLabel,
        value: 'H',
      },
    ],
  },
  I: {
    label: props.integrityLabel,
    choices: [
      {
        label: props.iNoneLabel,
        value: 'N',
      },
      {
        label: props.iLowLabel,
        value: 'L',
      },
      {
        label: props.iHighLabel,
        value: 'H',
      },
    ],
  },
  S: {
    label: props.scopeLabel,
    choices: [
      {
        label: props.sUnchangedLabel,
        value: 'U',
      },
      {
        label: props.sChangedLabel,
        value: 'C',
      },
    ],
  },
  A: {
    label: props.availabilityLabel,
    choices: [
      {
        label: props.aNoneLabel,
        value: 'N',
      },
      {
        label: props.aLowLabel,
        value: 'L',
      },
      {
        label: props.aHighLabel,
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
