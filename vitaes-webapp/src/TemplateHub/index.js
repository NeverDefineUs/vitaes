import React, { Component } from 'react';
import { toast } from 'react-toastify';

import TemplateHubModel from './TemplateHubModel'

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
        <h1>Template Hub</h1>
        {templateList}
        <br />
      </div>
    );
  }
}

export default TemplateHub;
