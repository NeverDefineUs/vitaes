import { toast } from 'react-toastify';

import getHostname from 'utils/getHostname';
import { translate } from 'i18n/locale';

export const likeTemplate = (user, template, fetchTemplates) => {
  if (user) {
    fetch(
      `${window.location.protocol
      }//${
        getHostname()
      }/template/like/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          templatename: template,
        }),
      },
    ).then(() => {
      fetchTemplates();
    });
  } else {
    toast.error(translate('error_not_logged_in'));
  }
};

export default { likeTemplate };
