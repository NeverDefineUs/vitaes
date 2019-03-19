import React from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import { ListGroup, Button } from 'react-bootstrap';

import { translate } from 'i18n/locale';

export function AlertList(props) {
  return _.values(_.map(props.alerts, (alertMsg, alertKey) => (
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
    </ListGroup.Item>
  )));
}

export default AlertList;
