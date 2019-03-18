import { getAvailableLocales } from 'i18n/locale';

export default function defaultAlert() {
  const message = { type: 'warning' };
  for (const language of getAvailableLocales()) {
    message[language] = '';
  }
  return message;
}