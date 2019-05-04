import React, { Component } from 'react';
import firebase from 'firebase';
import { Segment, Button } from 'semantic-ui-react';

import { getRendererHostname } from 'utils/getHostname';

import { getEmptyTemplate } from './util';
import TemplateField from './TemplateField';
import OwnedTemplate from './OwnedTemplate';

class AddTemplate extends Component {
  constructor() {
    super();
    this.state = { template: getEmptyTemplate() };
  }

  render() {
    const ownedCvs = Object.values(this.props.cv_models).filter(template =>
      (firebase.auth().currentUser && template.owner === firebase.auth().currentUser.uid));
    const ownedCvsNodes = ownedCvs.map(template =>
      (<OwnedTemplate template={template} key={template} />));

    const createTemplate = () => {
      fetch(`http://${getRendererHostname()}/template/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.template),
      });
      this.setState({ template: getEmptyTemplate() });
    };

    return (
      <Segment secondary>
        <h1>Create a template:</h1>
        <TemplateField
          placeholder="awesome"
          label="Name"
          value={this.state.template.name}
          callback={(e) => {
            const { template } = this.state;
            template.name = e.target.value;
            this.setState({ template });
          }}
        />
        <TemplateField
          placeholder="pdflatex"
          label="Command"
          value={this.state.template.command}
          callback={(e) => {
            const { template } = this.state;
            template.command = e.target.value;
            this.setState({ template });
          }}
        />
        <h2>Params:</h2>
        <Button
          secondary
          size="small"
          style={{ float: 'right' }}
          onClick={createTemplate}
        >
            Submit
        </Button>
        <Button secondary size="small" style={{ float: 'right' }} onClick={() => { }}>Add New Param</Button>
        <hr style={{ marginTop: '3em' }} />
        {ownedCvsNodes}
      </Segment>
    );
  }
}

export default AddTemplate;
