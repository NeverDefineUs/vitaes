import { strings, languageFallbackPriority, territoryFallbackPriority } from './strings';

const DEFAULT_LANGUAGE = 'en_US';

let availableLocales;
let activeLocale;
let memo;

const getActiveLanguage = () => activeLocale[0] + activeLocale[1];

const territoryFallback = (key, inputLanguage) => {
  const language = inputLanguage || getActiveLanguage();

  if (!territoryFallbackPriority[language]) {
    return undefined;
  }

  for (const idx in territoryFallbackPriority[language]) {
    const territory = territoryFallbackPriority[language][idx];
    if (strings[key][`${language}_${territory}`]) {
      return strings[key][`${language}_${territory}`];
    }
  }

  return undefined;
};

const languageFallback = (key) => {
  const activeLanguage = getActiveLanguage();

  for (const idx in languageFallbackPriority) {
    const language = languageFallbackPriority[idx];

    if (language !== activeLanguage) { // Already checked by territoryFallback
      const value = territoryFallback(key, language);

      if (value) {
        return value;
      }
    }
  }

  return undefined;
};

export const getBrowserLanguage = () => {
  if (!navigator) {
    return DEFAULT_LANGUAGE;
  }

  return (navigator.languages && navigator.languages[0])
    || navigator.language
    || navigator.userLanguage
    || navigator.browserLanguage
    || DEFAULT_LANGUAGE;
};

export const setLocale = (locale) => {
  activeLocale = locale || getBrowserLanguage();
  memo = {};
};

export const translate = (key) => {
  if (memo[key]) {
    return memo[key];
  }

  if (!strings[key]) {
    throw new Error(`Key '${key}' does not exists.`);
  }

  const value = strings[key][activeLocale]
    || territoryFallback(key)
    || languageFallback(key);

  if (value) {
    memo[key] = value;
    return value;
  }

  throw new Error(`No translation was found for key '${key}'.`);
};

export const getActiveLocale = () => activeLocale;

export const getAvailableLocales = () => {
  if (availableLocales) {
    return availableLocales;
  }

  availableLocales = [];
  languageFallbackPriority.forEach((language) => {
    territoryFallbackPriority[language].forEach((territory) => {
      availableLocales.push(`${language}_${territory}`);
    });
  });

  return availableLocales;
};

setLocale();
