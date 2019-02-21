export function capitalize(word) {
    word = word.replace('_', ' ')
    return word.charAt(0).toUpperCase() + word.slice(1)
}
