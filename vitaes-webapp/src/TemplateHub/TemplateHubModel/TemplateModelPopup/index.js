import React from 'react';
import { Modal } from 'react-bootstrap';


export const TemplateModelPopup = props => (
  <Modal show={props.show} onHide={props.onHide}>
    <Modal.Header closeButton>
      <Modal.Title>
        {props.title}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <img
        alt="Template preview"
        className="template-image"
        style={{ height: '40em' }}
        src={props.image}
      />
    </Modal.Body>
  </Modal>
);

export default TemplateModelPopup;
