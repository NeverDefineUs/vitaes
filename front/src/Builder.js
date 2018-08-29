import React, { Component } from 'react';
import './Builder.css';

class HeaderField extends Component {
  // label, mandatory, curriculum, stateChanger
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

class CvItemForm extends Component {
  // label, hidden
  render() {
    if (this.props.hide){
      return  <div>
                <div className="Base-subtitle">Work:</div><br/>
                <div className="Base-button"><a>Add</a></div><br/>
              </div>
    } else {
      return  <div>
                <div className="Base-subtitle">Worky:</div><br/>
                <div className="Base-button"><a>Add</a></div><br/>
              </div>
    }
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
      this.downloadCvAsJson = this.downloadCvAsJson.bind(this)
    }

    handleChangeHeader(event) {
      var aux = this.state.curriculum
      aux["CvHeaderItem"][event.target.name] = event.target.value
      this.setState({curriculum: aux})
    }

    downloadCvAsJson() {
      var element = document.createElement("a");
      var file = new Blob([JSON.stringify(this.state.curriculum)], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "cv.json";
      element.click();
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
                  <CvItemForm hide={true}/>
                  <div className="Base-subtitle">Education:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
                  <div className="Base-subtitle">Languages:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
                  <div className="Base-subtitle">Academic:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
                  <div className="Base-subtitle">Project:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/>
                  <div className="Base-subtitle">Achievements:</div><br/>
                  <div className="Base-button"><a>Add</a></div><br/><br/>
                  <div className="Base-button"><a onClick={this.downloadCvAsJson}>Json Download</a></div><br/>
              </div>
       }
 }

export default Builder;