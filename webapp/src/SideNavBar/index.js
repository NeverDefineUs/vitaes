import React from 'react';
import {createRef} from 'react';
//import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import firebase from 'firebase';
import { Header, Icon, Menu, Ref, Segment, Sidebar, Sticky } from 'semantic-ui-react';

import { translate } from 'i18n/locale';

// import Login from 'Login';
const SidebarStyle = {margin: 0, padding: 0, border:0, borderRadius:0};

class SideNavBar extends React.Component {
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
          <Sidebar.Pushable as={Segment} style={SidebarStyle}>
              <Sidebar
                as={Menu}
                animation='push'
                icon='labeled'
                inverted
                color="grey"
                vertical
                visible
                width='thin'
              >
                <Menu.Item as='a' href="/">
                  <Icon name='file' />
                  {translate('create_cv')}
                </Menu.Item>
                <Menu.Item as='a' href="/privacy">
                  <Icon name='book' />
                  {translate('privacy_policy')}
                </Menu.Item>
                <Menu.Item as='a' href="about">
                  <Icon name='info' />
                  {translate('about_the_project')}
                </Menu.Item>
              </Sidebar>
            <Sidebar.Pusher style={{overflow: "auto", height:"100%"}}>
              <Segment basic style={{overflow: "auto", height:"100%"}}>
                {this.props.children}
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        {/* <Navbar collapseOnSelect expand="lg" fixed="left" bg="dark" variant="dark">
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
              <NavDropdown title={translate('about_the_project')}>
                <NavDropdown.Item href="/about">{translate('about_the_project')}</NavDropdown.Item>
                <NavDropdown.Item href="/privacy">{translate('privacy_policy')}</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={translate('language')} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => onChangeLanguage('en_US')}>English</NavDropdown.Item>
                <NavDropdown.Item onClick={() => onChangeLanguage('pt_BR')}>Português</NavDropdown.Item>
              </NavDropdown>
              {user !== null && permissions !== null && permissions[user.uid]
                ? (
                  <NavDropdown title={translate('dev_options')} id="basic-nav-dropdown">
                    <NavDropdown.Item
                      href="/alert-manager"
                    >
                      {translate('alert_manager')}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      href="https://grafana.vitaes.io/"
                    >
                      Grafana
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      href="https://sqlite.vitaes.io/"
                    >
                      SQLite
                    </NavDropdown.Item>
                  </NavDropdown>
                )
                : null
              }
            </Nav>
            <Nav className="mr-sm-2">
              {user !== null ? (
                <Nav.Link onClick={this.logout}>{translate('sign_out')}</Nav.Link>
              ) : (
                <Nav.Link onClick={this.showLogin}>{translate('sign_in')}</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar> */}
        {/* <Login
          show={showLogin}
          onHide={this.hideLogin}
          skipLogin={() => {
            this.hideLogin();
          }}
        /> */}
      </React.Fragment>
    );
  }
}

export default SideNavBar;
