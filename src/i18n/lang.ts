import i18n from ".";
import { TOptions } from "i18next";

export const lang = (key: string, options?: TOptions): string => {
  return i18n.t(key, options) as string;
};