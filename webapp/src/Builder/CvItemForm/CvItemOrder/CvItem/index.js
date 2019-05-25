import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';

import { translate } from 'i18n/locale';

export const SortableCvItem = SortableElement(props => <CvItem {...props} />);

export const CvItem = ({
  item, name, eventDeleter, eventEnabler, eventExpander,
}) => (
  <Alert
    variant="secondary"
    style={{
      width: '100%', paddingBottom: 6, paddingRight: 5, paddingTop: 2, marginBottom: 5, marginTop: 5,
    }}
    key={name}
  >
    {name}
    <Button
      variant="dark"
      size="sm"
      onClick={eventDeleter}
      style={{ marginLeft: 5, float: 'right' }}
    >
      {translate('delete')}
    </Button>
    <Button
      variant="dark"
      size="sm"
      onClick={eventEnabler}
      style={{ marginLeft: 5, float: 'right' }}
    >
      {translate(item.disable ? 'hide' : 'show')}
    </Button>
    <Button
      variant="dark"
      size="sm"
      onClick={eventExpander}
      style={{ marginLeft: 5, float: 'right' }}
    >
      {translate('edit')}
    </Button>
  </Alert>
);
