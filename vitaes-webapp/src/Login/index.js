import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

import { strings } from './../i18n/strings';

import { googleLogin, facebookLogin, githubLogin } from './providers';
import './Login.css';


class Login extends Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {strings.signIn}
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
            {strings.skipLogin}
          </Button>
          <br />
          <Button
            style={{ background: '#4285f4', border: '#4285f488' }}
            className="Login-button"
            onClick={googleLogin}
            size="sm"
          >
            {strings.googleLogin}
          </Button>
          <br />
          <Button
            style={{ background: '#4267b2', border: '#4267b288' }}
            className="Login-button"
            onClick={facebookLogin}
            size="sm"
          >
            {strings.facebookLogin}
          </Button>
          <br />
          <Button
            style={{ background: '#333', border: '#3338' }}
            className="Login-button"
            onClick={githubLogin}
            size="sm"
          >
            {strings.githubLogin}
          </Button>
        </Modal.Body>
      </Modal>
    );
  }
}

Login.propTypes = {
  skipLogin: PropTypes.element.isRequired,
};

export default Login;
