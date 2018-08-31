import React, { Component } from 'react';
import './Builder.css';
const capitalize = (word) => {
  word = word.replace('_', ' ')
  return word.charAt(0).toUpperCase() + word.slice(1)
}

class CvHeaderField extends Component {
  // label, mandatory, curriculum, stateChanger
  render() {
    return <div className="Base-field">
            <div className="Base-label">{capitalize(this.props.label)}{this.props.mandatory ? "" : " (Opt)"}{this.props.label === "birthday" ? " [YYYY-MM-DD]" : ""}:</div>
            <input type="text" name={this.props.label} value={this.props.curriculum["CvHeaderItem"][this.props.label]} 
              className="Base-inputfield" 
              onChange={this.props.stateChanger}
            />
          </div>
  }
}

class CvField extends Component {
  // label, mandatory, toAdd, stateChanger, addField
  render() {
    return <div className="Base-field">
            <div className="Base-label">{capitalize(this.props.label)}{this.props.mandatory ? "" : " (Opt)"}{this.props.label.endsWith("date")?" [YYYY-MM-DD]":""}:</div>
            <input type="text" name={this.props.label} value={this.props.toAdd[this.props.label] === undefined ? "" : this.props.toAdd[this.props.label]} 
              className="Base-inputfield" 
              onChange={this.props.stateChanger}
              onKeyPress = {(e) => {
                  if(e.key === 'Enter'){
                    this.props.addField()
                  }
                }
              }
            />
          </div>
  }
}

class CvItemForm extends Component {
  // label, chosenLabel, curriculum, cvkey, stateChanger, fields, optFields, labelChanger
  constructor(props) {
    super(props)
    this.getEventDeleter = this.getEventDeleter.bind(this)
    this.getEventExpander = this.getEventExpander.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.addField = this.addField.bind(this)
    this.state = {toAdd: {}}
  }

  getEventDeleter(index) {
    return () => {
      var cv = this.props.curriculum
      cv[this.props.cvkey].splice(index, 1)
      this.props.stateChanger(cv)
    }
  }
  getEventExpander(index) {
    return () => {
      var cv = this.props.curriculum
      var toAdd = cv[this.props.cvkey][index]
      cv[this.props.cvkey].splice(index, 1)
      this.props.stateChanger(cv)
      if (toAdd["institution"] !== undefined) {
        toAdd["institution"] = toAdd["institution"]["CvInstitution"]["name"]
      }
      if (toAdd["location"] !== undefined) {
        toAdd["country"] = toAdd["location"]["CvLocation"]["country"]
        toAdd["city"] = toAdd["location"]["CvLocation"]["city"]
        toAdd["state"] = toAdd["location"]["CvLocation"]["state"]
        toAdd["location"] = undefined
      }
      this.setState({toAdd: toAdd})
      this.props.labelChanger(this.props.label)
    }
  }

  handleChange(event) {
    var aux = this.state.toAdd
    aux[event.target.name] = event.target.value
    if (aux[event.target.name] === "") {
      aux[event.target.name] = undefined
    }
    this.setState({toAdd: aux})
  }

  addField() {
    var cv = this.props.curriculum
    var toAdd = this.state.toAdd;
    for (var item of this.props.fields) {
      if (toAdd[item] === undefined) {
        alert("Needed Field: " + item)
        return
      }
    }
    if (toAdd["institution"] !== undefined) {
     var institution = {"CvInstitution": {"name": toAdd["institution"]}}
     toAdd["institution"] = institution
    }
    if (toAdd["country"] !== undefined || toAdd["state"] !== undefined || toAdd["city"] !== undefined){
      toAdd["location"] = {"CvLocation": {"country": toAdd["country"], "city": toAdd["city"], "state": toAdd["state"]}}
      toAdd["city"] = undefined
      toAdd["country"] = undefined
      toAdd["state"] = undefined
    }
    cv[this.props.cvkey].push(toAdd)
    this.props.stateChanger(cv)
    this.setState({toAdd: {}})
    this.props.labelChanger("")
  }

  render() {
    var nodes = [<div className="Base-linemarker"/>,<div className="Base-subtitle" key={-2}>{this.props.label}:</div>, <br key={-1}/>]
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
        nodes.push(<div className="Base-item" key={index}><span onClick={x.getEventExpander(index)}>{name}</span> <div className="Base-item-close" onClick={x.getEventDeleter(index)}><a>Delete</a></div></div>)
      })
    }
    if (this.props.chosenLabel !== this.props.label){
      return  <div>
                {nodes}
                <div className="Base-button" onClick={() => {this.props.labelChanger(this.props.label)}}><a>Add</a></div><br/>
              </div>
    } else {
      var formNodes = []
      if (this.props.fields !== undefined) {
        this.props.fields.forEach((field, index) =>{
          formNodes.push(<CvField stateChanger={this.handleChange} toAdd={this.state.toAdd} addField={this.addField} label={field} mandatory={true}/>)
        })
      }
      if (this.props.optFields !== undefined) {
        this.props.optFields.forEach((field, index) =>{
          formNodes.push(<CvField stateChanger={this.handleChange} toAdd={this.state.toAdd} addField={this.addField} label={field} mandatory={false}/>)
        })
      }
      return  <div>
                {nodes}
                <div className="Base-form">
                {formNodes}
                <div className="Base-button" onClick={this.addField}><a>Add</a></div>
                </div>
                <br/>
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
      this.state = {curriculum: testCv, chosenLabel: ""}
      this.handleChangeHeader = this.handleChangeHeader.bind(this)
      this.downloadCvAsJson = this.downloadCvAsJson.bind(this)
      this.downloadCvAsPDF = this.downloadCvAsPDF.bind(this)
      this.setCv = this.setCv.bind(this)
      this.setLabel = this.setLabel.bind(this)
      this.startFilePicker = this.startFilePicker.bind(this)
      this.uploadJSON = this.uploadJSON.bind(this)
    }

    handleChangeHeader(event) {
      var aux = this.state.curriculum
      aux["CvHeaderItem"][event.target.name] = event.target.value
      if (aux["CvHeaderItem"][event.target.name] === "") {
        aux["CvHeaderItem"][event.target.name] = undefined
      }
      this.setState({curriculum: aux})
    }

    downloadCvAsJson() {
      var element = document.createElement("a")
      var file = new Blob([JSON.stringify(this.state.curriculum)], {type: 'text/plain'})
      element.href = URL.createObjectURL(file)
      element.download = "cv.json"
      element.click()
    }

    downloadCvAsPDF() {
      fetch('http://' + window.location.hostname + ':5000/CV/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.curriculum)
      }).then(response => {
        if (response.ok) {
          var file = response.blob()
          file.then(file => {
            var element = document.createElement("a")
            element.href = URL.createObjectURL(file)
            element.download = "cv.pdf"
            element.click()
          })
        } else {
          var textPromise = response.text()
          textPromise.then(text => alert("Error:" + text))
        }
      })
    }

    setCv(cv) {
      this.setState({curriculum: cv})
    }

    setLabel(label) {
      this.setState({chosenLabel: label})
    }

    startFilePicker(e) {
      this.refs.fileUploader.click()
    }

    uploadJSON(selectorFiles)
    {
      var fr = new FileReader()
      fr.onload = function(e) {
        var json = fr.result;
        this.setState({curriculum: JSON.parse(json)})

      }.bind(this)
      fr.readAsText(selectorFiles[0])
    }

    render() {
       return <div className="Base">
                  <div className="Base-title">Curriculum Vitae:</div><br/>
                  <div className="Base-subtitle">Header:</div><br/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="name" mandatory={true}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="email" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="phone" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="linkedin" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="github" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="homepage" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="address" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.state.curriculum} label="birthday" mandatory={false}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Work" cvkey="CvWorkExperienceItem" curriculum={this.state.curriculum} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["institution", "start_date"]} optFields={["end_date", "country", "state", "city", "description", "role"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Education" cvkey="CvEducationalExperienceItem" curriculum={this.state.curriculum} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["institution", "course", "start_date"]} optFields={["end_date", "country", "state", "city", "description", "teacher"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Academic" cvkey="CvAcademicProjectItem" curriculum={this.state.curriculum} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["name", "start_date"]} optFields={["end_date", "description", "institution", "country", "state", "city", "article_link"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Achievements" cvkey="CvAchievementItem" curriculum={this.state.curriculum} stateChanger={this.setCv} labelChanger={this.setLabel}  fields={["name", "start_date"]} optFields={["end_date", "description", "institution", "country", "state", "city", "place", "certification_link"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Projects" cvkey="CvImplementationProjectItem" curriculum={this.state.curriculum} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["name", "start_date"]} optFields={["end_date", "description", "language", "country", "state", "city", "repository_link"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Languages" cvkey="CvLanguageItem" curriculum={this.state.curriculum} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["language", "level"]}/>
                  <br/>
                  <div className="Base-button"><a onClick={this.startFilePicker}>
                    <input type="file" id="file" ref="fileUploader" onChange={(e) => this.uploadJSON(e.target.files)} style={{display: "none"}}/>
                    Upload Json
                  </a></div>
                  <div className="Base-button"><a onClick={this.downloadCvAsJson}>Json Download</a></div>
                  <div className="Base-button"><a onClick={this.downloadCvAsPDF}>CV download</a></div><br/>
              </div>
       }
 }

export default Builder;