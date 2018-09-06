import React, { Component } from 'react'
import './Builder.css'
import firebase from 'firebase'

const capitalize = (word) => {
  word = word.replace('_', ' ')
  return word.charAt(0).toUpperCase() + word.slice(1)
}
const locFields = ["country", "state", "city"]

class CvHeaderField extends Component {
  // label, mandatory, curriculum, stateChanger
  render() {
    return <div className="Base-field">
            <div className="Base-label">{capitalize(this.props.label)}{this.props.mandatory ? " (Required)" : ""}{this.props.label === "birthday" ? " [YYYY-MM-DD]" : ""}:</div>
            <input type="text" name={this.props.label} value={this.props.curriculum["CvHeaderItem"][this.props.label] === undefined ? "" : this.props.curriculum["CvHeaderItem"][this.props.label]}
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
            <div className="Base-label">{capitalize(this.props.label === "name" ? "title" : this.props.label)}{this.props.mandatory ? " (Required)" : ""}{this.props.label.endsWith("date")?" [YYYY-MM-DD]":""}:</div>
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
        for (var locField of locFields){
          if (toAdd["location"]["CvLocation"][locField] !== undefined) {
            toAdd[locField] = toAdd["location"]["CvLocation"][locField]
          }
        }
        delete toAdd["location"]
      }
      this.setState({toAdd: toAdd})
      this.props.labelChanger(this.props.label)
    }
  }

  handleChange(event) {
    var aux = this.state.toAdd
    aux[event.target.name] = event.target.value
    if (aux[event.target.name] === "") {
      delete aux[event.target.name]
    }
    this.setState({toAdd: aux})
  }

  addField() {
    var cv = this.props.curriculum
    var toAdd = this.state.toAdd;
    for (var item of this.props.fields) {
      if (toAdd[item] === undefined) {
        if (item === "name") {
          alert("Needed Field: Title")
        } else {
          alert("Needed Field: " + capitalize(item))
        }
        return
      }
    }
    if (toAdd["institution"] !== undefined) {
     var institution = {"CvInstitution": {"name": toAdd["institution"]}}
     toAdd["institution"] = institution
    }
    if (toAdd["country"] !== undefined || toAdd["state"] !== undefined || toAdd["city"] !== undefined){
      var cvLocation = {}
      for (var locField of locFields) {
        if (toAdd[locField] !== undefined) {
          cvLocation[locField] = toAdd[locField]
        }
      }
      toAdd["location"] = {"CvLocation": cvLocation}
      for (locField of locFields) {
        delete toAdd[locField]
      }
    }
    if (cv[this.props.cvkey] === undefined) {
      cv[this.props.cvkey] = []
    }
    cv[this.props.cvkey].push(toAdd)
    this.props.stateChanger(cv)
    this.setState({toAdd: {}})
    this.props.labelChanger("")
  }

  render() {
    var nodes = [<div className="Base-linemarker" key={-3}/>,<div className="Base-subtitle" key={-2}>{this.props.label}:</div>, <br key={-1}/>]
    let x = this
    if (this.props.curriculum[this.props.cvkey] !== undefined) {
      this.props.curriculum[this.props.cvkey].forEach(function(item, index) {
        var name = ""
        if (item.name !== undefined) {
          name = item.name
        } else if (item.institution !== undefined) {
          name = item.institution.CvInstitution.name
        } else if (item.language !== undefined) {
          name = item.language
        } else {
          name = item.skill_type + ": " + item.skill_name
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
      this.state = {curriculum: this.props.cv, chosenLabel: "", render_key: "awesome-concrete", cv_models: ["awesome-concrete"]}
      this.handleChangeHeader = this.handleChangeHeader.bind(this)
      this.downloadCvAsJson = this.downloadCvAsJson.bind(this)
      this.downloadCvAsPDF = this.downloadCvAsPDF.bind(this)
      this.saveOnAccount = this.saveOnAccount.bind(this)
      this.setCv = this.setCv.bind(this)
      this.setLabel = this.setLabel.bind(this)
      this.startFilePicker = this.startFilePicker.bind(this)
      this.uploadJSON = this.uploadJSON.bind(this)
      this.accentsToLatex = this.accentsToLatex.bind(this)
      this.hostname = window.location.hostname + ':5000'
      if (this.hostname == 'vitaes.io:5000') {
        this.hostname = 'renderer.vitaes.io'
      }
      fetch('http://' + this.hostname + '/CVTYPES/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(response => {
        if (response.ok) {
          var jsonPromise = response.json()
          jsonPromise.then(json => {
            json.sort()
            this.setState({cv_models: json}
          )})
        } else {
          var textPromise = response.text()
          textPromise.then(text => alert("Error:" + text))
        }
      })
    }

    handleChangeHeader(event) {
      var aux = this.props.cv
      aux["CvHeaderItem"][event.target.name] = event.target.value
      if (aux["CvHeaderItem"][event.target.name] === "") {
        delete aux["CvHeaderItem"][event.target.name]
      }
      this.setCv(aux)
    }

    downloadCvAsJson() {
      var db = firebase.database().ref('cv-dumps-json').push()
      db.set(this.props.cv)
      var element = document.createElement("a")
      var file = new Blob([JSON.stringify(this.props.cv)], {type: 'text/plain'})
      element.href = URL.createObjectURL(file)
      element.download = "cv.json"
      element.click()
    }

    accentsToLatex(entry) {
      var ret = entry
      if (typeof entry === "string") {
        const accents = {
          
        }
        for (var substitution in accents) {
          var accent = accents[substitution]
          entry = entry.replace(accent, substitution)
        }
        ret = entry
      } else if (Array.isArray(entry)) {
        ret = []
        for (let key in entry) {
          ret.push(this.accentsToLatex(entry[key]))
        }
      } else if (typeof entry === "object") {
        ret = {}
        for (let key in entry) {
          ret[key] = this.accentsToLatex(entry[key])
        }
      } 
      return ret
    }

    downloadCvAsPDF() {
      var db = firebase.database().ref('cv-dumps').push()
      db.set(this.props.cv)
      fetch('http://' + this.hostname + '/CV/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"curriculum_vitae": this.accentsToLatex(this.props.cv), "render_key": this.state.render_key})
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

    saveOnAccount() {
      var user = this.props.user
      if (user !== null){
        var db = firebase.database().ref("cvs").child(user.uid)
        db.set(this.props.cv)
      }
    }

    setCv(cv) {
      this.props.cvSetter(cv)
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
        this.setCv(JSON.parse(json))

      }.bind(this)
      fr.readAsText(selectorFiles[0])
    }

    render() {
       var cv_model_options = []
       for (let cv_model of this.state.cv_models) {
        cv_model_options.push(<option key={cv_model} value={cv_model}>{capitalize(cv_model)}</option>)
       }
       return <div className="Base">
                  <div className="Base-title">Curriculum Vitae:</div><br/>
                  <div className="Base-subtitle">Header:</div><br/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="name" mandatory={true}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="email" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="phone" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="linkedin" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="github" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="homepage" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="address" mandatory={false}/>
                  <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="birthday" mandatory={false}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Work" cvkey="CvWorkExperienceItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["institution", "start_date"]} optFields={["end_date", "country", "state", "city", "description", "role"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Education" cvkey="CvEducationalExperienceItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["institution", "course", "start_date"]} optFields={["end_date", "country", "state", "city", "description", "teacher"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Academic Projects" cvkey="CvAcademicProjectItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["name", "start_date"]} optFields={["end_date", "description", "institution", "country", "state", "city", "article_link"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Achievements" cvkey="CvAchievementItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel}  fields={["name", "start_date"]} optFields={["end_date", "description", "institution", "country", "state", "city", "place", "certification_link"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Projects" cvkey="CvImplementationProjectItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["name", "start_date"]} optFields={["end_date", "description", "language", "country", "state", "city", "repository_link"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Languages" cvkey="CvLanguageItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["language", "level"]}/>
                  <CvItemForm chosenLabel={this.state.chosenLabel} label="Skills" cvkey="CvSkillItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={["skill_name", "skill_type"]}/>
                  <br/>
                  <select className="Base-select" onChange={(e) =>  this.setState({render_key: e.target.value})}>
                    {cv_model_options}
                  </select>
                  <br/>
                  <br/>
                  <div className="Base-button"><a onClick={this.startFilePicker}>
                    <input type="file" id="file" ref="fileUploader" onChange={(e) => this.uploadJSON(e.target.files)} style={{display: "none"}}/>
                    Upload Json
                  </a></div>
                  <div className="Base-button"><a onClick={this.downloadCvAsJson}>Json Download</a></div>
                  <div className="Base-button"><a onClick={this.downloadCvAsPDF}>CV download</a></div>
                  {this.props.user !== null ? <div className="Base-button"><a onClick={this.saveOnAccount}>Save on account</a></div> : null}<br/>
              </div>
       }
 }

export default Builder
