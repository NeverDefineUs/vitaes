import React, { Component } from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { googleLogin, facebookLogin, githubLogin } from './Util';

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <span className="Login-title">Login:</span>
        <br />
        <br />
        <br />
        <div className="Login-button">
          <a onClick={this.props.skipLogin}>Skip Login</a>
        </div>
        <br />
        <div className="Login-google Login-button">
          <a onClick={googleLogin}>Google Login</a>
        </div>
        <br />
        <div className="Login-facebook Login-button">
          <a onClick={facebookLogin}>Facebook Login</a>
        </div>
        <br />
        <div className="Login-github Login-button">
          <a onClick={githubLogin}>GitHub Login</a>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  skipLogin: PropTypes.element.isRequired,
};

export default Login;
