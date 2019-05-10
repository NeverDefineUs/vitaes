/* eslint-disable linebreak-style */
import React from 'react';

function LanguageToggle(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.onClick(e);
  };

  return (
    <div onClick={handleClick}>
      <img alt="flag" width="30px" height="20px" src={props.flag} />
      {props.children}
    </div>
  );
}

export default LanguageToggle;
