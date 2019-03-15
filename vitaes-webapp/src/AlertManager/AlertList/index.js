import React from 'react';
import firebase from 'firebase';
import { ListGroup, Button } from 'react-bootstrap';

import { strings } from 'i18n/strings';

export function AlertList(props) {
  const alerts = [];
  for (const alertKey in props.alerts) {
    const alertMsg = props.alerts[alertKey];
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
  return alerts;
}

export default AlertList;
