import { getAvailableLanguages } from 'i18n/locale';

export default function defaultAlert() {
  const message = { type: 'warning' };
  for (const language of getAvailableLanguages()) {
    message[language] = '';
  }
  return message;
}
