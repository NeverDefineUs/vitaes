import React, { useRef } from 'react';
import ScrollWatcher from './ScrollWatcher';

function TypeForm(props) {
  const { children } = props;

  return (
    <ScrollWatcher>
      {
                React.Children.map(children, (child) => {
                  const ref = useRef(null);
                  return React.cloneElement(child, { ref });
                })
            }
    </ScrollWatcher>
  );
}

export default TypeForm;
