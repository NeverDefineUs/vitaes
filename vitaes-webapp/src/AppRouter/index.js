import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import routes from './routes';

const AppRouter = () => (
  <Router>

    {routes.map(route => (
      <Route
        key={route.path}
        path={route.path}
        exact={route.exact}
        component={route.component}
      />
    ))}
  </Router>
);

export default AppRouter;
