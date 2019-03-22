import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

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
            size="sm"
          >
            {translate('skip_login')}
          </Button>
          <br />
          <Button
            style={{ background: '#4285f4', border: '#4285f488' }}
            className="Login-button"
            onClick={googleLogin}
            size="sm"
          >
            {translate('google_login')}
          </Button>
          <br />
          <Button
            style={{ background: '#4267b2', border: '#4267b288' }}
            className="Login-button"
            onClick={facebookLogin}
            size="sm"
          >
            {translate('facebook_login')}
          </Button>
          <br />
          <Button
            style={{ background: '#333', border: '#3338' }}
            className="Login-button"
            onClick={githubLogin}
            size="sm"
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
