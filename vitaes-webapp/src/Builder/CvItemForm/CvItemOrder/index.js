import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import { SortableCvItem } from './CvItem';

export const CvItemOrder = SortableContainer(props => (
  <div>
    {props.items.map((item, index) => {
      let name = '';
      if (item.name !== undefined) {
        ({ name } = item);
      } else if (item.institution !== undefined) {
        ({ name } = item.institution.CvInstitution);
      } else if (item.language !== undefined) {
        name = item.language;
      } else {
        name = `${item.skill_type}: ${item.skill_name}`;
      }
      return (
        <SortableCvItem
          name={name}
          item={item}
          key={name + JSON.stringify(item)}
          index={index}
          eventDeleter={props.getEventDeleter(index)}
          eventEnabler={props.getEventEnabler(index)}
          eventExpander={props.getEventExpander(index)}
        />
      );
    })}
  </div>
));

export default CvItemOrder;
