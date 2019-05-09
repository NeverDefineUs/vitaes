import React from 'react';

class LanguageToggle extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e) => {
      e.preventDefault();
      this.props.onClick(e);
  }

  render() {
    return (
        <img width="30px" height="20px" onClick={this.handleClick}  src={this.props.flag}>
            {this.props.children}
        </img>
    );
  }
}

export default LanguageToggle;
