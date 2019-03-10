import React, { Component } from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { googleLogin, facebookLogin, githubLogin } from './Util';
import { strings } from './i18n/strings';

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <h1>Login:</h1>
        <br />
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
      </div>
    );
  }
}

Login.propTypes = {
  skipLogin: PropTypes.element.isRequired,
};

export default Login;
