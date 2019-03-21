import React from 'react';
import firebase from 'firebase';

import TemplateHub from './TemplateHub';

class TemplateHubContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    firebase
      .auth()
      .getRedirectResult()
      .then(() => {
        const user = firebase.auth().currentUser;
        this.setState({ user });
      });
  }

  render() {
    return <TemplateHub user={this.state.user} />;
  }
}
export default TemplateHubContainer;
