import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

export const BugReporterField = props => (
  <Form.Group as={Row} {...props} size="sm">
    <Form.Label column sm="2">
      {props.label}
        :
    </Form.Label>
    <Col sm="10">
      <Form.Control
        type="text"
        as={props.long ? 'textarea' : 'input'}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => {
          props.setter(event.target.value);
        }}
      />
    </Col>
  </Form.Group>
);

export default BugReporterField;
