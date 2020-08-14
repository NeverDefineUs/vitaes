import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';

import { translate } from 'i18n/locale';

const SortableItem = SortableElement(({ value }) => (
  <Badge variant="secondary" style={{ width: '80%', marginLeft: '10%' }}>{value}</Badge>
));

const SortableList = SortableContainer(({ cvOrder }) => (
  <ul className="Base-orderlist">
    {cvOrder.map((value, index) => (
      <SortableItem key={`item-${value}`} index={index} value={translate(value)} />
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
  cvOrder: PropTypes.array.isRequired,
  setOrder: PropTypes.func.isRequired,
};

export default CvOrder;
