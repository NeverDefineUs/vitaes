export default function capitalize(rawWord) {
  const word = rawWord.replace('_', ' ');
  return word.charAt(0).toUpperCase() + word.slice(1);
}