import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import firebase from 'firebase';

import { translate } from 'i18n/locale';

import Login from 'Login';

class NavBar extends React.Component {
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
  }

  componentDidMount() {
    firebase
      .database()
      .ref('permissions')
      .on('value', (snapshot) => {
        this.setState({ permissions: snapshot.val() });
      });

    firebase
      .auth()
      .getRedirectResult()
      .then(() => {
        const user = firebase.auth().currentUser;
        this.setState({ user });
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
    const { onChangeLanguage } = this.props;
    const { user, permissions, showLogin } = this.state;

    return (
      <React.Fragment>
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
              {user !== null && permissions !== null && permissions[user.uid]
                ? (
                  [
                    <Nav.Link
                      key="create-template"
                      href="/create-template"
                    >
                      {translate('create_template')}
                    </Nav.Link>,
                    <Nav.Link
                      key="alert-manager"
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
              <NavDropdown title={translate('about_the_project')}>
                <NavDropdown.Item href="/about">{translate('about_the_project')}</NavDropdown.Item>
                <NavDropdown.Item href="/privacy">{translate('privacy_policy')}</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={translate('language')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => onChangeLanguage('en_US')}>English</NavDropdown.Item>
                <NavDropdown.Item onClick={() => onChangeLanguage('pt_BR')}>Português</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="mr-sm-2">
              {user !== null ? (
                <Nav.Link onClick={this.logout}>{translate('sign_out')}</Nav.Link>
              ) : (
                <Nav.Link onClick={this.showLogin}>{translate('sign_in')}</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Login
          show={showLogin}
          onHide={this.hideLogin}
          skipLogin={() => {
            this.hideLogin();
          }}
        />
      </React.Fragment>
    );
  }
}

export default NavBar;
