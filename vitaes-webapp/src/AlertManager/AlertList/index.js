import React from 'react';
import firebase from 'firebase';
import { ListGroup, Button } from 'react-bootstrap';

import { translate } from 'i18n/locale';

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
          {translate('delete')}
        </Button>
      </ListGroup.Item>,
    );
  }
  return alerts;
}

export default AlertList;
