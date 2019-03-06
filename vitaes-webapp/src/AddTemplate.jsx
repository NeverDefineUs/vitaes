import React, { Component } from 'react';
import firebase from 'firebase';
import { getEmptyTemplate, setTemplateFile } from './Template/Util';

class TemplateField extends Component {
  // label, placeholder, value, callback
  render() {
    return (
      <div className="Base-field">
        <div className="Base-label">
          {this.props.label}
:
        </div>
        <input
          type="text"
          name={this.props.label}
          value={this.props.value}
          className="Base-inputfield"
          placeholder={this.props.placeholder}
          onChange={this.props.callback}
        />
      </div>
    );
  }
}

class OwnedTemplate extends Component {
  constructor(props) {
    super(props);
    this.fileUploader = (
      <input
        type="file"
        style={{ display: 'none' }}
        onInput={this.setFile}
      />
    );

    this.setFile = this.setFile.bind(this);
    this.chooseAndUploadFile = this.chooseAndUploadFile.bind(this);
  }

  setFile(event) {
    const { files } = event.target;
    if (
      files.length === 1
      && files[0].name.substr(files[0].name.length - 4, 4) === '.zip'
    ) {
      const file = files[0];
      setTemplateFile(this.props.template, file);
    }
  }

  chooseAndUploadFile() {
    const baseFolder = this.props.template.base_folder;
    if (baseFolder === undefined || baseFolder.substr(0, 6) === 'mongo:') {
      this.fileUploader.click();
    }
  }

  render() {
    return (
      <div className="Base-item">
        {this.props.template.name}
        <div className="Base-item-close">
          {this.fileUploader}
          <a onClick={this.chooseAndUploadFile}>Upload zip</a>
        </div>
      </div>
    );
  }
}

class AddTemplate extends Component {
  constructor() {
    super();
    this.state = { template: getEmptyTemplate() };
  }

  render() {
    const ownedCvs = [];

    for (const cvKey in this.props.cv_models) {
      const template = this.props.cv_models[cvKey];
      if (template.owner === firebase.auth().currentUser.uid) {
        ownedCvs.push(<OwnedTemplate template={template} key={cvKey} />);
      }
    }

    return (
      <div className="Base">
        <div className="Base-title">Create a template:</div>
        <TemplateField
          placeholder="awesome"
          label="Name"
          value={this.state.name}
          callback={(e) => {
            const { template } = this.state;
            template.name = e.target.value;
            this.setState({ template });
          }}
        />
        <TemplateField
          placeholder="pdflatex"
          label="Command"
          value={this.state.command}
          callback={(e) => {
            const { template } = this.state;
            template.command = e.target.value;
            this.setState({ template });
          }}
        />
        <div className="Base-subtitle">Params:</div>
        <div className="Base-button">
          <a
            href="#"
            onClick={() => {
              fetch('http://localhost:5000/template/', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.template),
              });
              this.setState({ template: getEmptyTemplate() });
            }}
          >
            Submit
          </a>
        </div>
        <div className="Base-button">
          <a href="#" onClick={() => {}}>Add New Param</a>
        </div>
        <div className="Base-linemarker" style={{ marginTop: '3em' }} />
        {ownedCvs}
      </div>
    );
  }
}

export default AddTemplate;
