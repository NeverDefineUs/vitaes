import React, { useState } from 'react';
import firebase from 'firebase';
import { ToastContainer } from 'react-toastify';

import { setLocale } from './i18n/locale';

import config from './config';
import { setupAlerts } from './AlertManager/util';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './AppRouter';
import NavBar from './NavBar';


firebase.initializeApp(config);

const forceUpdate = () => {
  const [value, set] = useState(true); // boolean state
  return () => set(!value); // toggle the state to force render
};

function App() {
  setupAlerts();

  const useForceUpdate = forceUpdate();

  const handleChangeLanguage = (locale) => {
    setLocale(locale);
    useForceUpdate();
  };

  return (
    <React.Fragment>
      <ToastContainer position="bottom-right" />
      <NavBar onChangeLanguage={handleChangeLanguage} />
      <AppRouter className="bg-secondary" />
    </React.Fragment>
  );
}

export default App;
