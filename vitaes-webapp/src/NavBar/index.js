import React from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import firebase from 'firebase';

import { translate } from 'i18n/locale';
import LanguageToggle from './LanguageToggle';

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
        <Navbar collapseOnSelect expand="lg" fixed="top" bg="gradient-black" variant="">
            <Navbar.Brand href="/">
                <img src="/logo.svg" width="80" height="45"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="font-24 ml-auto">
                <Nav.Link className="color-white mr-3" href="/">{ translate("make_cv") }</Nav.Link>
                <Nav.Link className="color-white mr-3" href="/about"> { translate("about") } </Nav.Link>
                <Nav.Link className="color-white mr-4" href="/about"> { translate("login") } </Nav.Link>
                <Dropdown className="mr-5 mt-2">
                  <Dropdown.Toggle as={LanguageToggle} flag="/flag-brazil.png"></Dropdown.Toggle>
                  <Dropdown.Menu className="w-10">
                    <Dropdown.Item onClick={() => onChangeLanguage('en_US')}><img width="30px" height="20px" src="/flag-brazil.png"></img></Dropdown.Item>
                    <Dropdown.Item onClick={() => onChangeLanguage('en_US')}><img width="30px" height="20px" src="/flag-us.png"></img></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    )
    //   <React.Fragment>
    //     <Navbar collapseOnSelect expand="lg" fixed="top" bg="dark" variant="dark">
    //       <Navbar.Brand href="/">
    //         <img
    //           alt=""
    //           src="/mod5.svg"
    //           width="30"
    //           height="30"
    //           className="d-inline-block align-top"
    //         />
    //         {' Vitaes'}
    //       </Navbar.Brand>
    //       <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //       <Navbar.Collapse id="basic-navbar-nav">
    //         <Nav className="mr-auto">
    //           <Nav.Link
    //             href="/"
    //           >
    //             {translate('create_cv')}
    //           </Nav.Link>
    //           <Nav.Link
    //             href="/hub"
    //           >
    //             Template Hub
    //           </Nav.Link>
    //           <NavDropdown title={translate('about_the_project')}>
    //             <NavDropdown.Item href="/about">{translate('about_the_project')}</NavDropdown.Item>
    //             <NavDropdown.Item href="/privacy">{translate('privacy_policy')}</NavDropdown.Item>
    //           </NavDropdown>
    //           <NavDropdown title={translate('language')} id="basic-nav-dropdown">
    //             <NavDropdown.Item onClick={() => onChangeLanguage('en_US')}>English</NavDropdown.Item>
    //             <NavDropdown.Item onClick={() => onChangeLanguage('pt_BR')}>Português</NavDropdown.Item>
    //           </NavDropdown>
    //           {user !== null && permissions !== null && permissions[user.uid]
    //             ? (
    //               <NavDropdown title={translate('dev_options')} id="basic-nav-dropdown">
    //                 <NavDropdown.Item
    //                   href="/create-template"
    //                 >
    //                   {translate('create_template')}
    //                 </NavDropdown.Item>
    //                 <NavDropdown.Item
    //                   href="/alert-manager"
    //                 >
    //                   {translate('alert_manager')}
    //                 </NavDropdown.Item>
    //                 <NavDropdown.Item
    //                   href="https://grafana.vitaes.io/"
    //                 >
    //                   Grafana
    //                 </NavDropdown.Item>
    //               </NavDropdown>
    //             )
    //             : null
    //           }
    //         </Nav>
    //         <Nav className="mr-sm-2">
    //           {user !== null ? (
    //             <Nav.Link onClick={this.logout}>{translate('sign_out')}</Nav.Link>
    //           ) : (
    //             <Nav.Link onClick={this.showLogin}>{translate('sign_in')}</Nav.Link>
    //           )}
    //         </Nav>
    //       </Navbar.Collapse>
    //     </Navbar>
    //     <Login
    //       show={showLogin}
    //       onHide={this.hideLogin}
    //       skipLogin={() => {
    //         this.hideLogin();
    //       }}
    //     />
    //   </React.Fragment>
    // );
  }
}

export default NavBar;
