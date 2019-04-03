import React, { useState } from 'react';
import { toast } from 'react-toastify';

import capitalize from 'utils/capitalize';
import { translate } from 'i18n/locale';
import getHostname from 'utils/getHostname';

import './TemplateHubModel.css';
import { TemplateModelPopup } from './TemplateModelPopup';

export const TemplateHubModel = (props) => {
  const [show, setShow] = useState(false);

  const { model } = props;
  const parameters = [];
  for (const val of model.params) {
    parameters.push(<div>{capitalize(val.pretty_name)}</div>);
    const paramOptions = [];
    for (const opt in val.mapped_options) {
      paramOptions.push(<li>{opt}</li>);
    }
    parameters.push(<ul>{paramOptions}</ul>);
  }
  return (
    <div>
      <div className="template-title-bar">
        <div className="template-name">{capitalize(props.keyName)}</div>
        <div className="template-linemark" />
      </div>
      <div className="template-info">
        <TemplateModelPopup
          show={show}
          onHide={() => setShow(false)}
          image={model.data.image}
          title={props.keyName}
        />
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <img
          alt="Template preview"
          className="template-image"
          src={model.data.image}
          onClick={() => setShow(true)}
        />
        <div
          className="template-button"
          role="button"
          onClick={() => {
            if (props.user) {
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
                    uid: props.user.uid,
                    templatename: props.keyName,
                  }),
                },
              ).then(() => {
                props.fetchTemplates();
              });
            } else {
              toast.error(translate('error_not_logged_in'));
            }
          }
        }
        >
          <a>
            <img alt="" src="/Ei-heart.svg" />
            <span>{model.data.likes}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TemplateHubModel;
