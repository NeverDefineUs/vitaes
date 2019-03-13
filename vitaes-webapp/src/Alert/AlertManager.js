import React, { Component } from 'react';
import {
  Card, ListGroup,
} from 'react-bootstrap';
import { strings } from '../i18n/strings';
import { AlertList } from './AlertList';
import { AlertCreationForm } from './AlertCreationForm';
import { setAlertCallback } from './Util';

export class AlertManager extends Component {
  constructor(props) {
    super(props);
    this.state = { alerts: [] };
    setAlertCallback((value) => { this.setState({ alerts: value }); });
  }

  render() {
    return (
      [
        <AlertCreationForm />,
        <Card>
          <Card.Header>{strings.alerts}</Card.Header>
          <ListGroup variant="flush">
            <AlertList alerts={this.state.alerts} />
          </ListGroup>
        </Card>,
      ]
    );
  }
}

export default AlertManager;
