export default function validateDate(dateStr) {
  const date = new Date(dateStr);
  const day = Number(dateStr[8] + dateStr[9]);
  const month = Number(dateStr[5] + dateStr[6]);
  const year = Number(dateStr[0] + dateStr[1] + dateStr[2] + dateStr[3]);
  if (
    date.getUTCMonth() + 1 !== month
    || date.getUTCDate() !== day
    || date.getUTCFullYear() !== year
  ) {
    return false;
  }
  return true;
}
