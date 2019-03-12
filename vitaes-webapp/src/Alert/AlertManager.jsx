import React, { Component } from 'react';
import firebase from 'firebase';
import {
  Card, Button, InputGroup, Form, ListGroup,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { strings } from '../i18n/strings';
import { copyElement } from '../Util';
import { setAlertCallback } from './Util';

export class AlertManager extends Component {
  constructor(props) {
    super(props);
    const message = { type: 'warning' };
    for (const language of strings.getAvailableLanguages()) {
      message[language] = '';
    }
    this.state = { message, alerts: [] };
    setAlertCallback((value) => { this.setState({ alerts: value }); });
    this.addAlert = this.addAlert.bind(this);
  }

  addAlert() {
    const errorRef = firebase.database().ref('messages').push();
    let message = copyElement(this.state.message);
    if (!message.en) {
      toast.error(strings.noEnMessageError);
      return;
    }
    errorRef.set(message);
    message = { type: 'warning' };
    for (const language of strings.getAvailableLanguages()) {
      message[language] = '';
    }
    this.setState({ message });
  }

  render() {
    const alerts = [];
    for (const alertKey in this.state.alerts) {
      const alertMsg = this.state.alerts[alertKey];
      alerts.push(
        <ListGroup.Item>
          {alertMsg.en}
          <Button
            style={{ float: 'right' }}
            size="sm"
            variant="secondary"
            onClick={() => firebase.database().ref('messages').child(alertKey).remove()}
          >
            {strings.delete}
          </Button>
        </ListGroup.Item>,
      );
    }

    const forms = [];
    for (const key in this.state.message) {
      if (key !== 'type') {
        const msg = (
          <InputGroup
            key={key}
            value={this.state.message[key]}

            style={{ marginBottom: 10 }}
          >
            <InputGroup.Prepend>
              <InputGroup.Text>{key}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              aria-describedby="inputGroupPrepend"
              required
              value={this.state.message[key]}
              onChange={(event) => {
                const { message } = this.state;
                message[key] = event.target.value;
                this.setState({ message });
              }}
            />
          </InputGroup>
        );
        forms.push(msg);
      }
    }
    return (
      [
        <Card style={{ marginBottom: 10 }}>
          <Card.Body>
            <Card.Title>{strings.alertManager}</Card.Title>
            {forms}
            {/* The entries must stay not translated */}
            <Form.Group>
              <Form.Label>{strings.alertType}</Form.Label>
              <Form.Control
                value={this.state.message.type}
                onChange={(event) => {
                  const message = copyElement(this.state.message);
                  message.type = event.target.value;
                  this.setState({ message });
                }}
                as="select"
              >
                <option>default</option>
                <option>warning</option>
                <option>info</option>
                <option>error</option>
                <option>success</option>
              </Form.Control>
            </Form.Group>
            <Button style={{ float: 'right' }} onClick={this.addAlert} variant="dark">{strings.addAlert}</Button>
          </Card.Body>
        </Card>,
        <Card>
          <Card.Header>Featured</Card.Header>
          <ListGroup variant="flush">
            {alerts}
          </ListGroup>
        </Card>,
      ]
    );
  }
}

export default AlertManager;
