import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { strings } from './i18n/strings';

const SortableItem = SortableElement(({ value }) => (
  <li><Badge variant="secondary" style={{ width: '80%', marginLeft: '10%' }}>{value}</Badge></li>
));

const SortableList = SortableContainer(({ cvOrder }) => (
  <ul className="Base-orderlist">
    {cvOrder.map((value, index) => (
      <SortableItem key={`item-${value}`} index={index} value={strings[value]} />
    ))}
  </ul>
));

class CvOrder extends Component {
  render() {
    return (
      <SortableList
        cvOrder={this.props.cvOrder}
        onSortEnd={this.props.setOrder}
      />
    );
  }
}

CvOrder.propTypes = {
  cvOrder: PropTypes.element.isRequired,
  setOrder: PropTypes.element.isRequired,
};

export default CvOrder;
