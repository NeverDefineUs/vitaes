export function capitalize(word) {
  word = word.replace('_', ' ');
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getHostname() {
  let hostname = `${window.location.hostname}:5000`;
  if (hostname === 'vitaes.io:5000') {
    hostname = 'renderer.vitaes.io';
  }
  return hostname;
}

export function copyElement(element) {
  return JSON.parse(JSON.stringify(element));
}

export function removeDisabled(cv) {
  cv = copyElement(cv);
  for (const key in cv) {
    if (Array.isArray(cv[key])) {
      cv[key] = cv[key].filter(element => !element.disable);
    }
  }
  return cv;
}
