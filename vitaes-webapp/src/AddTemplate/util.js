import firebase from 'firebase';
import { toast } from 'react-toastify';

import getHostname from 'utils/getHostname';

export function getEmptyTemplate() {
  return {
    owner: firebase.auth().currentUser.uid,
    command: '',
    data: { likes: 0 },
    name: '',
    params: {},
    fixed_params: {},
  };
}

export function setTemplateFile(template, file) {
  const form = new FormData();
  form.append('file', file);

  fetch(
    `${window.location.protocol
    }//${
      getHostname()
    }/template/files/${
      template.name
    }/`,
    {
      method: 'POST',
      body: form,
    },
  ).then((response) => {
    if (!response.ok) {
      const textPromise = response.text();
      textPromise.then(text => toast.error(`Error:${text}`));
    }
  });
}
