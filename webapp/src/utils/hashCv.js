import { sha256 } from 'js-sha256';

export default function hashCv(cvObj) {
  return sha256(JSON.stringify(cvObj));
}
