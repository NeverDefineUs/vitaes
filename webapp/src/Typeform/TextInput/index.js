import React from 'react';

const TextInput = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <input placeholder={props.placeholder} className={props.className} type="text" name={props.name} />
  </div>
));

export default TextInput;
