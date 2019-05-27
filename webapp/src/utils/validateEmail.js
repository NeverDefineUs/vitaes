export default function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
