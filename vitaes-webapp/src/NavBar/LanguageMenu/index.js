import React from 'react';

function LanguageMenu(props) {
  const {
    children,
    style,
    className,
    'aria-labelledBy': labeledBy,
  } = props;

  return (
    <div style={style} className={className} aria-labelledby={labeledBy}>
      <ul className="list-unstyled">
        { children }
      </ul>
    </div>
  );
}

export default LanguageMenu;
