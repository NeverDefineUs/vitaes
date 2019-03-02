import React, {Component} from 'react';
import './Login.css'

class Login extends Component {
    render() {
        return <div className="Login">
            <span className="Login-title">Login:</span>
            <br/>
            <br/>
            <br/>
            <div className="Login-button">
                <a onClick={this.props.skipLogin}>
                Skip Login
                </a>
            </div>
            <br/>
            <div className="Login-google Login-button">
                <a onClick={this.props.googleLogin}>
                Google Login
                </a>
            </div>
            <br/>
            <div className="Login-facebook Login-button">
                <a onClick={this.props.facebookLogin}>
                Facebook Login
                </a>
            </div>
        </div>
    }
}
export default Login