import React, { Component } from 'react';
import './Builder.css';
import './TemplateHub.css';
import { toast } from 'react-toastify';
import { capitalize } from './Util';

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
            src="https://imgur.com/download/qwvtvlj"
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

class TemplateHub extends Component {
  constructor(props) {
    super(props);
    this.state = { cv_models: {} };
    this.hostname = `${window.location.hostname}:5000`;
    if (this.hostname === 'vitaes.io:5000') {
      this.hostname = 'renderer.vitaes.io';
    }
    this.fetchTemplates = this.fetchTemplates.bind(this);
    this.fetchTemplates();
  }

  fetchTemplates() {
    fetch(`${window.location.protocol}//${this.hostname}/template/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        const jsonPromise = response.json();
        jsonPromise.then((json) => {
          this.setState({ cv_models: json });
        });
      } else {
        const textPromise = response.text();
        textPromise.then(text => toast.error(`Error:${text}`));
      }
    });
  }

  render() {
    const templateList = [];
    for (const key in this.state.cv_models) {
      templateList.push(
        <TemplateHubModel
          fetchTemplates={this.fetchTemplates}
          user={this.props.user}
          keyName={key}
          model={this.state.cv_models[key]}
        />,
      );
    }
    return (
      <div className="Base">
        <div className="Base-title">Template Hub</div>
        {templateList}
        <br />
      </div>
    );
  }
}

export default TemplateHub;
