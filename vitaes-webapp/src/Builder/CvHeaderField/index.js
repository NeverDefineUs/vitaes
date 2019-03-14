import React, { Component } from 'react';
import { Form, Col, Row } from 'react-bootstrap';

import { strings } from 'i18n/strings';
import capitalize from 'utils/capitalize';

class CvHeaderField extends Component {
  // label, id, placeholder, mandatory, curriculum, stateChanger
  render() {
    return (
      <Form.Group as={Row} size="sm">
        <Form.Label column sm="2">
          {capitalize(this.props.label)}
          {this.props.mandatory ? ` (${strings.required})` : ''}
          :
        </Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            value={
              this.props.curriculum.CvHeaderItem[this.props.id]
                === undefined
                ? ''
                : this.props.curriculum.CvHeaderItem[this.props.id]
            }
            name={this.props.id}
            placeholder={this.props.placeholder}
            onChange={this.props.stateChanger}
          />
        </Col>
      </Form.Group>
    );
  }
}

export default CvHeaderField;