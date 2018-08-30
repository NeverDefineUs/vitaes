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
  // label, hide, curriculum, cvkey, stateChanger
  constructor(props) {
    super(props)
    this.getEventDeleter = this.getEventDeleter.bind(this)
  }

  getEventDeleter(index) {
    return () => {
      var cv = this.props.curriculum
      cv[this.props.cvkey].splice(index, 1)
      this.props.stateChanger(cv)
    }
  }

  render() {
    var nodes = [<div className="Base-subtitle" key={-2}>{this.props.label}:</div>, <br key={-1}/>]
    let x = this
    if (this.props.curriculum[this.props.cvkey] !== undefined) {
      this.props.curriculum[this.props.cvkey].forEach(function(item, index) {
        var name = ""
        if (item.name !== undefined) {
          name = item.name
        } else if (item.institution !== undefined) {
          name = item.institution.CvInstitution.name
        } else {
          name = item.language
        }
        nodes.push(<div className="Base-item" key={index}>{name} <div className="Base-item-close" onClick={x.getEventDeleter(index)}><a>Delete</a></div></div>)
      })
    }
    if (this.props.hide){
      return  <div>
                {nodes}
                <div className="Base-button"><a>Add</a></div><br/>
              </div>
    } else {
      return  <div>
                {nodes}
                <div className="Base-button"><a>Add</a></div><br/>
              </div>
    }
  }
}

class Builder extends Component {
    constructor(props) {
      super(props)
      let testCv = 
      {
          "CvHeaderItem": {
              "name": ""
          },
          "CvWorkExperienceItem": [],
          "CvAcademicProjectItem": [],
          "CvImplementationProjectItem": [],
          "CvAchievementItem": [],
          "CvEducationalExperienceItem": [],
          "CvLanguageItem": []
      }
      this.state = {curriculum: testCv}
      let a={curriculum: 
        { 
          "CvHeaderItem": 
          {
            "name": "Your Name", 
          }
        }
      }
      this.handleChangeHeader = this.handleChangeHeader.bind(this)
      this.downloadCvAsJson = this.downloadCvAsJson.bind(this)
      this.setCv = this.setCv.bind(this)
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

    setCv(cv) {
      this.setState({curriculum: cv})
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
                  <CvItemForm hide={true} label="Work" cvkey="CvWorkExperienceItem" curriculum={this.state.curriculum} stateChanger={this.setCv}/>
                  <CvItemForm hide={true} label="Education" cvkey="CvEducationalExperienceItem" curriculum={this.state.curriculum} stateChanger={this.setCv}/>
                  <CvItemForm hide={true} label="Academic" cvkey="CvAcademicProjectItem" curriculum={this.state.curriculum} stateChanger={this.setCv}/>
                  <CvItemForm hide={true} label="Achievements" cvkey="CvAchievementItem" curriculum={this.state.curriculum} stateChanger={this.setCv}/>
                  <CvItemForm hide={true} label="Projects" cvkey="CvImplementationProjectItem" curriculum={this.state.curriculum} stateChanger={this.setCv}/>
                  <CvItemForm hide={true} label="Languages" cvkey="CvLanguageItem" curriculum={this.state.curriculum} stateChanger={this.setCv}/>
                  <br/>
                  <div className="Base-button"><a onClick={this.downloadCvAsJson}>Json Download</a></div><br/>
              </div>
       }
 }

export default Builder;