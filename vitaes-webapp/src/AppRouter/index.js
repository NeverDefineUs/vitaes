import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';

import routes from './routes';

const AppRouter = () => (
  <Router>
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Col>
      </Row>
    </Container>
  </Router>
);

export default AppRouter;
