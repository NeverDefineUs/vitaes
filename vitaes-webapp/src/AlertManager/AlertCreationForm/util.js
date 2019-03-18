export function defaultAlert() {
  const message = { type: 'warning' };
  for (const language of getAvaliableLocales()) {
    message[language] = '';
  }
  return message;
}