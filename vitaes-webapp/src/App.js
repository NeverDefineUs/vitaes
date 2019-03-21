import React, { Component } from 'react';

import firebase from 'firebase';
import {
  Navbar, Nav, NavDropdown, Row, Col, Container,
} from 'react-bootstrap';

import { translate, setLocale } from 'i18n/locale';

import Login from './Login';
import config from './config';
import { setupAlerts } from './AlertManager/util';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './AppRouter';


firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      permissions: null,
      showLogin: false,
    };
    this.showLogin = this.showLogin.bind(this);
    this.hideLogin = this.hideLogin.bind(this);
    this.logout = this.logout.bind(this);
    setupAlerts();
    const dbHP = firebase.database().ref('permissions');
    dbHP.on('value', (snapshot) => {
      this.setState({ permissions: snapshot.val() });
    });
  }

  logout() {
    firebase.auth().signOut();
    this.setState({ user: null });
  }

  showLogin() {
    this.setState({ showLogin: true });
  }

  hideLogin() {
    this.setState({ showLogin: false });
  }

  render() {
    const login = (
      <Login
        show={this.state.showLogin}
        onHide={this.hideLogin}
        skipLogin={() => {
          this.hideLogin();
        }}
      />
    );
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" fixed="top" bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <img
              alt=""
              src="/mod5.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            {' Vitaes'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                href="/"
              >
                {translate('create_cv')}
              </Nav.Link>
              {this.state.user !== null
                && this.state.permissions !== null
                && this.state.permissions[this.state.user.uid]
                ? (
                  [
                    <Nav.Link
                      href="/create-template"
                    >
                      {translate('create_template')}
                    </Nav.Link>,
                    <Nav.Link
                      href="/alert-manager"
                    >
                      {translate('alert_manager')}
                    </Nav.Link>,
                  ]
                ) : null}
              <Nav.Link
                href="/hub"
              >
                Template Hub
              </Nav.Link>
              <Nav.Link
                href="/about"
              >
                {translate('about_the_project')}
              </Nav.Link>
              <NavDropdown title={translate('language')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => { setLocale('en_US'); this.setState({}); }}>English</NavDropdown.Item>
                <NavDropdown.Item onClick={() => { setLocale('pt_BR'); this.setState({}); }}>Português</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="mr-sm-2">
              {this.state.user !== null ? (
                <Nav.Link onClick={this.logout}>{translate('sign_out')}</Nav.Link>
              ) : (
                <Nav.Link onClick={this.showLogin}>{translate('sign_in')}</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <br />
        {login}
        <Container>
          <Row className="justify-content-md-center">
            <Col>
              <AppRouter />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
