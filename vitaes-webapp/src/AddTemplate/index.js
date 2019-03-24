import React, { Component } from 'react';
import { toast } from 'react-toastify';

import getHostname from 'utils/getHostname';
import { translate } from 'i18n/locale';

import AddTemplate from './AddTemplate';

class AddTemplateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cv_models: [],
    };
  }

  componentDidMount() {
    fetch(`${window.location.protocol}//${getHostname()}/template/`, {
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
        textPromise.then(text => toast.error(`${translate('error')}: ${text}`));
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <AddTemplate cv_models={this.state.cv_models} />
      </React.Fragment>
    );
  }
}

export default AddTemplateContainer;
