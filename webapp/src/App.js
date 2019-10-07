import React, { Component } from 'react';
import firebase from 'firebase';
import { ToastContainer } from 'react-toastify';

import { setLocale } from 'i18n/locale';

import config from './config';
import { setupAlerts } from './AlertManager/util';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './AppRouter';
import SideNavBar from './SideNavBar';
import NavBar from './NavBar';

firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    setupAlerts();
    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
  }

  handleChangeLanguage(locale) {
    setLocale(locale);
    this.forceUpdate();
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer position="bottom-right" />
        { window.innerWidth < 1024 ? 
        <NavBar onChangeLanguage={this.handleChangeLanguage}>
          <AppRouter />
        </NavBar> :
        <SideNavBar onChangeLanguage={this.handleChangeLanguage}>
          <AppRouter />
        </SideNavBar>}
      </React.Fragment>
    );
  }
}

export default App;
