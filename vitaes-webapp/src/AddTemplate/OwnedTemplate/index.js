import React, { Component } from 'react';
import { setTemplateFile } from '../util';

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

export default OwnedTemplate;
