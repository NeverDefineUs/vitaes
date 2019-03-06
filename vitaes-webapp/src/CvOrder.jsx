import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';

const SortableItem = SortableElement(({ value }) => (
  <li className="Base-item Base-orderlist">{value}</li>
));

const SortableList = SortableContainer(({ cvOrder }) => (
  <ul className="Base-orderlist">
    {cvOrder.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
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
