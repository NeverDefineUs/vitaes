import React, { Component } from 'react';

import { capitalize } from 'Util';

import './TemplateHubModel.css';

class TemplateHubModel extends Component {
  constructor(props) {
    super(props);
    this.hostname = `${window.location.hostname}:5000`;
    if (this.hostname === 'vitaes.io:5000') {
      this.hostname = 'renderer.vitaes.io';
    }
  }

  render() {
    const { model } = this.props;
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
          <div className="template-name">{capitalize(this.props.keyName)}</div>
          <div className="template-linemark" />
        </div>
        <div className="template-info">
          <img
            alt="Template preview"
            className="template-image"
            src={model.data.image}
          />
          <div
            className="template-button"
            role="button"
            onClick={() => {
              fetch(
                `${window.location.protocol
                }//${
                this.hostname
                }/template/like/`,
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    uid: this.props.user.uid,
                    templatename: this.props.keyName,
                  }),
                },
              ).then(() => {
                this.props.fetchTemplates();
              });
            }}
          >
            <a>
              <img alt="" src="/Ei-heart.svg" />
              <span>{model.data.likes}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default TemplateHubModel;