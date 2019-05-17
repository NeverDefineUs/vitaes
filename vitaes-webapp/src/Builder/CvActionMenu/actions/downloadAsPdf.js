import validateEmail from 'utils/validateEmail';
import validateDate from 'utils/validateDate';
import removeDisabled from 'utils/removeDisabled';
import hashCv from 'utils/hashCv';
import { getApiHostname } from 'utils/getHostname';
import logger from 'utils/logger';
import fetch from 'fetch-retry';


import { translate, getActiveLocale } from 'i18n/locale';

export default function downloadCvAsPDF(userData, downloadState, showBugUiState, events) {
  const { downloading, setDownloading } = downloadState;
  const { setShowBugUi } = showBugUiState;
  const {
    loading, validationError, success, serverError,
  } = events;

  if (downloading) {
    return;
  }

  if (!validateEmail(userData.cv.CvHeaderItem.email)) {
    validationError(translate('invalid_email_format'));
    return;
  }

  if (userData.cv.CvHeaderItem.name === '') {
    validationError(translate('invalid_name_format'));
    return;
  }
  if (userData.cv.CvHeaderItem.birthday) {
    if (!validateDate(userData.cv.CvHeaderItem.birthday)) {
      validationError(translate('invalid_birthday_format'));
      return;
    }
  }

  const cv = removeDisabled(userData.cv);

  // TODO this should be receiving full locale
  let { params } = userData;
  params = {};
  params.lang = getActiveLocale();

  const requestCv = {
    curriculum_vitae: cv,
    section_order: userData.cv_order,
    render_key: userData.user_cv_model,
    params,
  };
  requestCv.path = hashCv(requestCv);

  logger(requestCv, 'FRONT_REQUEST', JSON.stringify(requestCv));

  setDownloading(true);

  const startTime = window.performance.now();

  fetch(`${window.location.protocol}//${getApiHostname()}/cv/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestCv),
  }).then((response) => {
    if (response.ok) {
      const idPromise = response.text();

      loading();

      idPromise.then((id) => {
        fetch(
          `${window.location.protocol}//${getApiHostname()}/cv/${id}/`,
          {
            method: 'GET',
            retries: 20,
            retryDelay: 1000,
            retryOn: [404],
          },
        ).then((cvresponse) => {
          if (cvresponse.ok) {
            const fileBlob = cvresponse.blob();
            fileBlob.then((file) => {
              const element = document.createElement('a');
              element.href = URL.createObjectURL(file);
              element.download = 'cv.pdf';
              element.click();
            });
            const serveTime = window.performance.now();
            logger(requestCv, 'SERVED_FOR_DOWNLOAD', serveTime - startTime);
            success();
            setDownloading(false);
          } else {
            logger(requestCv, 'FAILURE_NOTIFIED');
            serverError();
            setDownloading(false);
            setShowBugUi(true);
          }
        });
      });
    } else {
      const textPromise = response.text();
      textPromise.then(text => validationError(`${translate('error')}: ${text}`));
    }
  });
}
