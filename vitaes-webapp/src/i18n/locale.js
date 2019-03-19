import { strings, languageFallbackPriority, territoryFallbackPriority } from './strings';

const DEFAULT_LANGUAGE = 'en_US';

let availableLocales;
let activeLocale;
let memo;

export const getActiveLanguage = () => activeLocale.split('_')[0];

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
  let language = DEFAULT_LANGUAGE;

  if (navigator) {
    let preferredLanguageFound = false;
    if (navigator.languages) {
      for (const idx in navigator.languages) {
        if (!preferredLanguageFound && navigator.languages[idx]) {
          language = navigator.languages[idx];
          preferredLanguageFound = true;
        }
      }
    }

    if (!preferredLanguageFound) {
      language = navigator.language
        || navigator.browserLanguage
        || navigator.userLanguage
        || DEFAULT_LANGUAGE;
    }
  }

  return language.replace('-', '_');
};

export const setLocale = (locale) => {
  // Avoid executing this function multiple times at every import
  if (activeLocale && !locale) {
    return;
  }

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
