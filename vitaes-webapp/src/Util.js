export function capitalize(word) {
    word = word.replace('_', ' ')
    return word.charAt(0).toUpperCase() + word.slice(1)
}

export function getHostname() {
  var hostname = window.location.hostname + ':5000'
  if (hostname === 'vitaes.io:5000') {
    hostname = 'renderer.vitaes.io'
  }
  return hostname
}