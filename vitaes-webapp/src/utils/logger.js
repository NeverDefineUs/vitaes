import fetch from 'fetch-retry';

import { getLoggerHostname } from 'utils/getHostname';

export default function logger(req, step, data) {
  const formData = new URLSearchParams();
  formData.append('email', req.curriculum_vitae.header.email);
  formData.append('cv_hash', req.path);
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
