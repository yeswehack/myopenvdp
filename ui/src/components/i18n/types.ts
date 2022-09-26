import descriptions from './descriptions.json';

export type VdpFormTranslation = {
  [String in keyof typeof descriptions]: string;
};
export type VdpFormTranslationKey = keyof VdpFormTranslation;
export type VdpFormPartialTranslation = Partial<Record<VdpFormTranslationKey, string>>;
