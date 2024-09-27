import { nextTick } from "vue";
import { createI18n } from "vue-i18n";

export const SUPPORT_LOCALES = ["uz-cyrl", "uz-latn", "ru", "qr", "en"];
export const locale = localStorage.getItem("lang") || import.meta.env.VITE_I18N_LOCALE;

export async function loadLocaleMessages(locale: string) {
  // load locale messages with dynamic import

  const messages = await import(`./locales/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages);
  return nextTick();
}

const i18n = createI18n({
  locale: locale,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  runtimeOnly: false,
  silentTranslationWarn: true
});

loadLocaleMessages(i18n.global.locale.value);

export default i18n;
