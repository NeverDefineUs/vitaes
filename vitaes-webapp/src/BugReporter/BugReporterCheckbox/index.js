import React from 'react';
import { Form } from 'react-bootstrap';

export const BugReporterCheckbox = props => (
  <Form.Group {...props} size="sm">
    <Form.Check
      type="checkbox"
      label={props.label}
      checked={props.value}
      onClick={(event) => {
        props.setter(event.target.checked);
      }}
    />
  </Form.Group>
);

export default BugReporterCheckbox;
