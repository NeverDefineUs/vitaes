import React, { Component } from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { googleLogin, facebookLogin, githubLogin } from './Util';
import { strings } from './i18n/strings';

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <span className="Login-title">Login:</span>
        <br />
        <br />
        <br />
        <div className="Login-button">
          <a onClick={this.props.skipLogin}>{strings.skipLogin}</a>
        </div>
        <br />
        <div className="Login-google Login-button">
          <a onClick={googleLogin}>{strings.googleLogin}</a>
        </div>
        <br />
        <div className="Login-facebook Login-button">
          <a onClick={facebookLogin}>{strings.facebookLogin}</a>
        </div>
        <br />
        <div className="Login-github Login-button">
          <a onClick={githubLogin}>{strings.githubLogin}</a>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  skipLogin: PropTypes.element.isRequired,
};

export default Login;
