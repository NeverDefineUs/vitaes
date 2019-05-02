export default function getHostname() {
  if (process.env.NODE_ENV === 'development') {
    return 'localhost:5000';
  }
  return 'renderer.vitaes.io';
}
