import React from 'react';
import {
    Button,
  } from 'react-bootstrap';
  import Dropzone from 'react-dropzone';
  
import { translate, } from 'i18n/locale';

function ActionMenu (props) {
    return (
        <React.Fragment>
            <Dropzone onDrop={files => props.uploadJSON(files)}>
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
          onClick={props.downloadCvAsJson}
          style={{ marginLeft: 5, float: 'right' }}
        >
          {translate('download_json')}
        </Button>
        <Button
          disabled={props.downloading}
          variant="secondary"
          size="sm"
          onClick={props.downloadCvAsPDF}
          style={{ marginLeft: 5, float: 'right' }}
        >
          {translate('download_cv')}
        </Button>
        {props.user !== null ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={props.saveOnAccount}
            style={{ marginLeft: 5, float: 'right' }}
          >
            {translate('save_cv_on_account')}
          </Button>
        ) : null}
        {props.user !== null ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => props.updateUserData({ autosave: !props.userData.autosave })}
            style={{ marginLeft: 5, float: 'right' }}
          >
            {props.userData.autosave ? translate('autosave_on') : translate('autosave_off')}
          </Button>
        ) : null}
        </React.Fragment>        
    )
}

export default ActionMenu;