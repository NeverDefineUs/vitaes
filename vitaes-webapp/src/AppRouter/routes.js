import React from 'react';

import Builder from 'Builder';
import TemplateHub from 'TemplateHub';
import AlertManager from 'AlertManager';
import AddTemplate from 'AddTemplate';
import About from 'About';
import PrivacyPolicy from 'PrivacyPolicy';


export default [
  { path: '/', component: () => <Builder />, exact: true },
  { path: '/create-template', component: () => <AddTemplate />, exact: false },
  { path: '/alert-manager', component: () => <AlertManager />, exact: false },
  { path: '/hub', component: () => <TemplateHub />, exact: false },
  { path: '/about', component: () => <About />, exact: false },
  { path: '/privacy', component: () => <PrivacyPolicy />, exact: false },
];
