import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';

import { translate } from 'i18n/locale';

import { googleLogin, facebookLogin, githubLogin } from './providers';
import './Login.css';


class Login extends Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {translate('sign_in')}
            :
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Button
            variant="dark"
            className="Login-button"
            onClick={this.props.skipLogin}
            size="small"
          >
            {translate('skip_login')}
          </Button>
          <Button
            primary
            style={{
              background: '#4285f4', marginTop: 10, border: '#4285f488',
            }}
            className="Login-button"
            onClick={googleLogin}
            size="small"
          >
            {translate('google_login')}
          </Button>
          <Button
            primary
            style={{
              background: '#4267b2', marginTop: 10, border: '#4267b288',
            }}
            className="Login-button"
            onClick={facebookLogin}
            size="small"
          >
            {translate('facebook_login')}
          </Button>
          <Button
            primary
            style={{
              background: '#333', marginTop: 10, border: '#3338',
            }}
            className="Login-button"
            onClick={githubLogin}
            size="small"
          >
            {translate('github_login')}
          </Button>
        </Modal.Body>
      </Modal>
    );
  }
}

Login.propTypes = {
  skipLogin: PropTypes.func.isRequired,
};

export default Login;
