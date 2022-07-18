import { renderTemplate } from '../../utils';
import defaultFormTranslations from './langs/default';
import { VdpFormTranslationKey } from './types';

export type TrProvider = (key: VdpFormTranslationKey, data?: Record<string, string | number>) => string;

export const rawTr = (key: VdpFormTranslationKey) => defaultFormTranslations[key];
export const tr: TrProvider = (key: VdpFormTranslationKey, data: Record<string, string | number> = {}) =>
  renderTemplate(rawTr(key), data);
