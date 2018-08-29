import React, { Component } from 'react';
import './Builder.css';

class HeaderField extends Component {
  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
  render() {
    return <div className="Base-field">
            <div className="Base-label">{this.capitalize(this.props.label)}{this.props.mandatory ? "" : " (Opt)"}:</div>
            <input type="text" name={this.props.label} value={this.props.curriculum["CvHeaderItem"][this.props.label]} 
              className="Base-inputfield" 
              onChange={this.props.stateChanger}
            />
          </div>
  }
}

class Builder extends Component {
    constructor(props) {
      super(props)
      this.state = {curriculum: 
        { "CvHeaderItem": 
          {
            "name": "Your Name", 
          }
        }
      }
      this.handleChangeHeader = this.handleChangeHeader.bind(this)
    }

    handleChangeHeader(event) {
      var aux = this.state.curriculum
      aux["CvHeaderItem"][event.target.name] = event.target.value
      this.setState({curriculum: aux})
    }

    render() {
       return <div className="Base">
                  <div className="Base-title">Curriculum Vitae:</div><br/>
                  <div className="Base-subtitle">Header:</div><br/>
                  <HeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="name" mandatory={true}/>
                  <HeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="email" mandatory={false}/>
                  <HeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="phone" mandatory={false}/>
                  <HeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="linkedin" mandatory={false}/>
                  <HeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="github" mandatory={false}/>
                  <HeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="homepage" mandatory={false}/>
                  <HeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="Address" mandatory={false}/>
                  <HeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="Birthday" mandatory={false}/>
                  <div className="Base-subtitle">Work:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
                  <div className="Base-subtitle">Education:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
                  <div className="Base-subtitle">Languages:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
                  <div className="Base-subtitle">Academic Experience:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
                  <div className="Base-subtitle">Achievements:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
              </div>
       }
 }

export default Builder;