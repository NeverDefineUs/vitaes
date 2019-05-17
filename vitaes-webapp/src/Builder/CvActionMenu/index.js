import React, { useState } from 'react';
import {
  Button,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import { translate } from 'i18n/locale';
import { toast } from 'react-toastify';

import _downloadAsPDF from './actions/downloadAsPdf';
import _saveOnAccount from './actions/saveOnAccount';
import _uploadJSON from './actions/uploadJSON';
import _downloadAsJson from './actions/downloadAsJson';

const autoSaveTime = 15000;

function ActionMenu(props) {
  const [downloading, setDownloading] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  function validationError(message) {
    return toast.error(message);
  }

  function loading() {
    return toast(`${translate('loading')}...`, { autoClose: false, toastId: 'downloading' });
  }

  function successPdf() {
    return toast.update('downloading', { render: `${translate('ready')}!`, autoClose: 5000, type: toast.TYPE.INFO });
  }

  function successSaveAccount() {
    return toast.success(translate('saved'), {
      toastId: 'autosv',
    });
  }

  function serverError() {
    return toast.update('downloading', { render: translate('error_processing_file'), autoClose: 5000, type: toast.TYPE.ERROR });
  }

  const pdfEvents = {
    validationError,
    loading,
    success: successPdf,
    serverError,
  };

  function downloadCvAsPDF() {
    return _downloadAsPDF(props.userData, {
      downloading,
      setDownloading,
    }, { setShowBugUi: props.setShowBugUi }, pdfEvents);
  }

  function saveOnAccount() {
    _saveOnAccount(props.user, props.userData, successSaveAccount);
    setLastSaved(JSON.stringify(props.userData));
  }

  function uploadJSON(selectorFiles) {
    _uploadJSON(selectorFiles, props.setCv);
  }

  function downloadCvAsJson() {
    _downloadAsJson(props.userData);
  }

  function initAutoSave() {
    setInterval(() => {
      if (props.userData.autosave
        && JSON.stringify(props.userData) !== lastSaved) {
        saveOnAccount();
      }
    }, autoSaveTime);
  }

  initAutoSave();

  return (
    <React.Fragment>
      <Dropzone onDrop={files => uploadJSON(files)}>
        {({ getRootProps, getInputProps }) => (
          <Button
            {...getRootProps()}
            variant="secondary"
            size="sm"
            style={{ marginLeft: 5, float: 'right' }}
          >
            <input
              {...getInputProps()}
              type="file"
              id="file"
              style={{ display: 'none' }}
            />
            {translate('upload_json')}
          </Button>
        )}
      </Dropzone>
      <Button
        variant="secondary"
        size="sm"
        onClick={downloadCvAsJson}
        style={{ marginLeft: 5, float: 'right' }}
      >
        {translate('download_json')}
      </Button>
      <Button
        disabled={downloading}
        variant="secondary"
        size="sm"
        onClick={downloadCvAsPDF}
        style={{ marginLeft: 5, float: 'right' }}
      >
        {translate('download_cv')}
      </Button>
      {props.user !== null ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={saveOnAccount}
          style={{ marginLeft: 5, float: 'right' }}
        >
          {translate('save_cv_on_account')}
        </Button>
      ) : null}
      {props.user !== null ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setAutoSave(!autoSave)}
          style={{ marginLeft: 5, float: 'right' }}
        >
          {autoSave ? translate('autosave_on') : translate('autosave_off')}
        </Button>
      ) : null}
    </React.Fragment>
  );
}

export default ActionMenu;
