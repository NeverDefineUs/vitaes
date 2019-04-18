import React from 'react';
import _ from 'lodash';

import Builder from 'Builder';
import TemplateHub from 'TemplateHub';
import AlertManager from 'AlertManager';
import AddTemplate from 'AddTemplate';
import About from 'About';
import PrivacyPolicy from 'PrivacyPolicy';
import { getAvailableLanguages, setLocale } from 'i18n/locale';

const getI18nPaths = (rawPaths) => {
  const paths = [];
  const languages = getAvailableLanguages();
  rawPaths.forEach((path) => {
    paths.push(path);
    languages.forEach((language) => {
      const localizedPath = _.cloneDeep(path);
      localizedPath.path = `/${language}${localizedPath.path}`;
      localizedPath.component = () => {
        setLocale(language);
        return path.component();
      };
      paths.push(localizedPath);
    });
  });
  return paths;
};

export const rawPaths = [
  { path: '/', component: () => <Builder />, exact: true },
  { path: '/create-template', component: () => <AddTemplate />, exact: true },
  { path: '/alert-manager', component: () => <AlertManager />, exact: true },
  { path: '/hub', component: () => <TemplateHub />, exact: true },
  { path: '/about', component: () => <About />, exact: true },
  { path: '/privacy', component: () => <PrivacyPolicy />, exact: true },
];

export default getI18nPaths(rawPaths);
