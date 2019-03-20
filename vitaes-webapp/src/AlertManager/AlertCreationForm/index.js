import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import {
  Button, Card, Form, InputGroup,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import { translate } from 'i18n/locale';

import defaultAlert from './default';

export class AlertCreationForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: defaultAlert() };
    this.addAlert = this.addAlert.bind(this);
  }

  addAlert() {
    const errorRef = firebase.database().ref('messages').push();
    const message = _.cloneDeep(this.state.message);
    if (!message.en) {
      toast.error(translate('no_en_message_error'));
      return;
    }
    errorRef.set(message);
    this.setState({ message: defaultAlert() });
  }

  render() {
    const forms = Object.values(_.map(_.pickBy(this.state.message, (value, key) => key !== 'type'), (value, key) => (
      <InputGroup
        key={key}
        value={value}
        style={{ marginBottom: 10 }}
      >
        <InputGroup.Prepend>
          <InputGroup.Text>{key}</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          type="text"
          aria-describedby="inputGroupPrepend"
          required
          value={value}
          onChange={(event) => {
            const { message } = this.state;
            message[key] = event.target.value;
            this.setState({ message });
          }}
        />
      </InputGroup>
    )));

    return (
      <Card style={{ marginBottom: 10 }}>
        <Card.Body>
          <Card.Title>{translate('alert_manager')}</Card.Title>
          {forms}
          {/* The entries must stay not translated */}
          <Form.Group>
            <Form.Label>{translate('alert_type')}</Form.Label>
            <Form.Control
              value={this.state.message.type}
              onChange={(event) => {
                const message = _.cloneDeep(this.state.message);
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
          <Button style={{ float: 'right' }} onClick={this.addAlert} variant="dark">{translate('add_alert')}</Button>
        </Card.Body>
      </Card>
    );
  }
}

export default AlertCreationForm;
