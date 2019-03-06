import React, { Component } from 'react';
import './Login.css';
import PropTypes from 'prop-types';

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <span className="Login-title">Login:</span>
        <br />
        <br />
        <br />
        <div className="Login-button">
          <a href="#" tabIndex="skip" onClick={this.props.skipLogin}>Skip Login</a>
        </div>
        <br />
        <div className="Login-google Login-button">
          <a href="#" tabIndex="google" onClick={this.props.googleLogin}>Google Login</a>
        </div>
        <br />
        <div className="Login-facebook Login-button">
          <a href="#" tabIndex="facebook" onClick={this.props.facebookLogin}>Facebook Login</a>
        </div>
        <br />
        <div className="Login-github Login-button">
          <a href="#" tabIndex="github" onClick={this.props.githubLogin}>GitHub Login</a>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  skipLogin: PropTypes.element.isRequired,
  googleLogin: PropTypes.element.isRequired,
  facebookLogin: PropTypes.element.isRequired,
  githubLogin: PropTypes.element.isRequired,
};

export default Login;
