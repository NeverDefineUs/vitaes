import md5 from 'md5';

export default function hashCv(cvObj) {
  return md5(JSON.stringify(cvObj) + Date.now());
}
