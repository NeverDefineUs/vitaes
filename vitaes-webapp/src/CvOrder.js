import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ value }) => (
  <li className="Base-item Base-orderlist">{value}</li>
));

const SortableList = SortableContainer(({ cvOrder }) => {
  return (
    <ul className="Base-orderlist">
      {cvOrder.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

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

export default CvOrder;
