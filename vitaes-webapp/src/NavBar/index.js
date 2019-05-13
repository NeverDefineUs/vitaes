import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import firebase from 'firebase';

import { translate, getActiveLocale } from 'i18n/locale';
import LanguageToggle from './LanguageToggle';
import LanguageMenu from './LanguageMenu';
import DevMenu from './DevMenu';
import Login from 'Login';

function NavBar(props) {
  const [user, setUser] = useState(null);
  const [permissions, setPerm] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const { onChangeLanguage } = props;

  const currentPath = window.location.pathname;
  let flag;

  const setFlag = (locale) => {
    flag = `/flag-${locale}.png`;
  };

  setFlag(getActiveLocale());

  useEffect(() => {
    const getPermissions = () => {
      firebase.database().ref('permissions').on('value', (snapshot) => { setPerm(snapshot.val()); });
    }

    const getUser = async () => {
      await firebase.auth().getRedirectResult();
      setUser(firebase.auth().currentUser);
    };

    getPermissions();
    getUser();
  }, []);

  const logout = () => {
    firebase.auth().signOut();
    setUser(null);
  };

  const changeLanguage = (locale) => {
    onChangeLanguage(locale);
    setFlag(locale);
  };

  const AuthButton = () => {
    if (user) {
      return (<Nav.Link className="mr-4" onClick={() => logout()}>{ translate('sign_out') }</Nav.Link>);
    }
    return (<Nav.Link className="mr-4" onClick={() => setShowLogin(true)}>{ translate('sign_in') }</Nav.Link>);
  };
  
  return (
    <React.Fragment>
      <Navbar collapseOnSelect expand="lg" fixed="top" bg="gradient-black" variant="gradient-black">
        <Navbar.Brand href="/">
          <img alt="vitaes logo" src="/logo.svg" width="80" height="45" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="font-24 ml-auto">
            <Nav.Link className="mr-3" href="/" active={currentPath === '/'}>
              { translate('make_cv') }
            </Nav.Link>
            <Nav.Link className="mr-3" href="/about" active={currentPath === '/about'}>
              { translate('about') }
            </Nav.Link>
            <AuthButton />
            <DevMenu hasPermissions={user && permissions ? permissions[user.uid] : null} />
            <Dropdown alignRight className="mr-5 mt-2">
              <Dropdown.Toggle as={LanguageToggle} flag={flag}></Dropdown.Toggle>
              <Dropdown.Menu as={LanguageMenu} style={{ 'min-width': '1rem', 'max-width': '4rem', 'max-height': '6rem' }} className="p-2">
                <Dropdown.Item className="pl-1 w-20" onClick={() => changeLanguage('pt_BR')}>
                  <img alt="brazil flag" width="30px" height="20px" src="/flag-pt_BR.png" />
                </Dropdown.Item>
                <Dropdown.Item className="pl-1 w-20" onClick={() => changeLanguage('en_US')}>
                  <img alt="united states flag" width="30px" height="20px" src="/flag-en_US.png" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Login
          show={showLogin}
          onHide={() => { 
            setShowLogin(false); 
          }}
          skipLogin={() => {
            setShowLogin(false);
          }}
        />
    </React.Fragment>
  );
}

export default NavBar;
