import fetch from 'fetch-retry';

import { getLoggerHostname } from 'utils/getHostname';

export default function logger(cv, step, data) {
  const formData = new URLSearchParams();
  formData.append('email', cv.email);
  formData.append('cv_hash', cv.cv_hash);
  formData.append('origin', 'WEBAPP');
  formData.append('step', step);
  if (data) {
    formData.append('data', data);
  }
  fetch(`${window.location.protocol}//${getLoggerHostname()}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: formData.toString(),
  });
}
