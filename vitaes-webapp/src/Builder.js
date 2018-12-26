import React, { Component } from 'react'
import './Builder.css'
import CvOrder from './CvOrder.js'
import firebase from 'firebase'
import TextareaAutosize from 'react-autosize-textarea'
import {arrayMove} from 'react-sortable-hoc'
import {capitalize} from './Util'
import fetch from 'fetch-retry'

const locFields = [["country", "Country name"], ["state", "State name"], ["city", "City name"]]

class CvHeaderField extends Component {
  // label, placeholder, mandatory, curriculum, stateChanger
  render() {
    return (
      <div className="Base-field">
        <div className="Base-label">
          {capitalize(this.props.label)}
          {this.props.mandatory ? " (Required)" : ""}
          {this.props.label === "birthday" ? " [YYYY-MM-DD]" : ""}:
        </div>
        <input 
          type="text"
          name={this.props.label}
          value={this.props.curriculum["CvHeaderItem"][this.props.label] === undefined ? "" : this.props.curriculum["CvHeaderItem"][this.props.label]}
          className="Base-inputfield"
          placeholder={this.props.placeholder}
          onChange={this.props.stateChanger}
        />
      </div>
    )
  }
}

class CvField extends Component {
  // label, placeholder, mandatory, toAdd, stateChanger, addField
  constructor(props){
    super(props)
  }
  render() {
    var inputField
    if (this.props.label !== "description") {
      inputField = 
        <input 
          type="text" 
          name={this.props.label} 
          value={this.props.toAdd[this.props.label] === undefined ? "" : this.props.toAdd[this.props.label]}
          className="Base-inputfield"
          onChange={this.props.stateChanger}
          placeholder={this.props.placeholder}
          onKeyPress = {
            (e) => {
              if(e.key === 'Enter') {
                this.props.addField()
              }
            }
          }
        />
    } else {
      inputField =
        <TextareaAutosize 
          type="text" 
          name={this.props.label} 
          value={this.props.toAdd[this.props.label] === undefined ? "" : this.props.toAdd[this.props.label]}
          className="Base-textareafield"
          onChange={this.props.stateChanger}
          placeholder={this.props.placeholder}
          rows={1}
        />
    }
    
    return (
      <div className="Base-field">
        <div className="Base-label">
          {capitalize(this.props.label === "name" ? "title" : this.props.label)}
          {this.props.mandatory ? " (Required)" : ""}
          {this.props.label.endsWith("date")?" [YYYY-MM-DD]":""}:
        </div>
        {inputField}
      </div>
    )
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
      if (this.props.label === this.props.chosenLabel) {
        if (!this.addField()) {
          return
        }
      }
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
      if (toAdd[item[0]] === undefined) {
        if (item[0] === "name") {
          alert("Needed Field: Title")
        } else {
          alert("Needed Field: " + capitalize(item[0]))
        }
        return false
      }
    }
    for (let item in toAdd) {
      if (item.endsWith("date") && toAdd[item]) {
        if (!toAdd[item].match(/^\d{4}-\d{2}-\d{2}$/)) {
          alert("Wrong format:" + item)
          return false
        }
      }
    }
    if (toAdd["institution"] !== undefined) {
     var institution = {"CvInstitution": {"name": toAdd["institution"]}}
     toAdd["institution"] = institution
    }
    if (toAdd["country"] !== undefined || toAdd["state"] !== undefined || toAdd["city"] !== undefined){
      var cvLocation = {}
      for (var locField of locFields) {
        if (toAdd[locField[0]] !== undefined) {
          cvLocation[locField[0]] = toAdd[locField[0]]
        }
      }
      toAdd["location"] = {"CvLocation": cvLocation}
      for (locField of locFields) {
        delete toAdd[locField[0]]
      }
    }
    if (cv[this.props.cvkey] === undefined) {
      cv[this.props.cvkey] = []
    }
    cv[this.props.cvkey].push(toAdd)
    this.props.stateChanger(cv)
    this.setState({toAdd: {}})
    this.props.labelChanger("")
    return true
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
      return (
        <div>
          {nodes}
          <div 
            className="Base-button" 
            onClick={() => this.props.labelChanger(this.props.label)}
          >
            <a>Add</a>
          </div>
          <br/>
        </div>
      )
    } else {
      var formNodes = []
      if (this.props.fields !== undefined) {
        this.props.fields.forEach((field_info, index) =>{
          formNodes.push(<CvField stateChanger={this.handleChange} toAdd={this.state.toAdd} addField={this.addField} label={field_info[0]} placeholder={field_info[1]} mandatory={true}/>)
        })
      }
      if (this.props.optFields !== undefined) {
        this.props.optFields.forEach((field_info, index) =>{
          formNodes.push(<CvField stateChanger={this.handleChange} toAdd={this.state.toAdd} addField={this.addField} label={field_info[0]} placeholder={field_info[1]} mandatory={false}/>)
        })
      }
      return (
        <div>
          {nodes}
          <div className="Base-form">
            {formNodes}
            <div 
              className="Base-button" 
              onClick={this.addField}
            >
              <a>Add</a>
            </div>
          </div>
          <br/>
        </div>
      )
    }
  }
}

class Builder extends Component {
    constructor(props) {
      super(props)
      this.state = {curriculum: this.props.cv, chosenLabel: "", user_cv_model: "awesome", cv_models: {}, cv_order:['work', 'education', 'achievement', 'project', 'academic', 'language', 'skill'], params:{}}
      this.handleChangeHeader = this.handleChangeHeader.bind(this)
      this.downloadCvAsJson = this.downloadCvAsJson.bind(this)
      this.downloadCvAsPDF = this.downloadCvAsPDF.bind(this)
      this.saveOnAccount = this.saveOnAccount.bind(this)
      this.setCv = this.setCv.bind(this)
      this.setLabel = this.setLabel.bind(this)
      this.startFilePicker = this.startFilePicker.bind(this)
      this.uploadJSON = this.uploadJSON.bind(this)
      this.hostname = window.location.hostname + ':5000'
      if (this.hostname === 'vitaes.io:5000') {
        this.hostname = 'renderer.vitaes.io'
      }
      fetch( window.location.protocol + '//' + this.hostname + '/template/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(response => {
        if (response.ok) {
          var jsonPromise = response.json()
          jsonPromise.then(json => {
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
      var db = firebase.database().ref('cv-dumps-json').child('EMAIL:' + (this.props.user !== null ? this.props.user.uid : (this.props.cv['CvHeaderItem']['email'] !== undefined ? this.props.cv['CvHeaderItem']['email'].replace(/\./g,'_dot_'):''))).push()
      db.set(this.props.cv)
      var element = document.createElement("a")
      var file = new Blob([JSON.stringify(this.props.cv)], {type: 'text/plain'})
      element.href = URL.createObjectURL(file)
      element.download = "cv.json"
      element.click()
    }

    downloadCvAsPDF() {
      var db = firebase.database().ref('cv-dumps').child('EMAIL:' + (this.props.user !== null ? this.props.user.uid : (this.props.cv['CvHeaderItem']['email'] !== undefined ? this.props.cv['CvHeaderItem']['email'].replace(/\./g,'_dot_'):''))).push()
      db.set(this.props.cv)
      fetch( window.location.protocol + '//' + this.hostname + '/cv/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"curriculum_vitae": this.props.cv, "section_order": this.state.cv_order, "render_key": this.state.user_cv_model, params: this.state.params})
      }).then(response => {
        if (response.ok) {
          var idPromise = response.text()
          idPromise.then(id => {
            fetch( window.location.protocol + '//' + this.hostname + '/cv/' + id + '/', {
              method: 'GET',
              retries: 20,
              retryDelay: 1000,
              retryOn: [404]
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
                alert("Error processing file")
              }
            })
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
      for (let cv_model_name in this.state.cv_models) {
        var cv_model = this.state.cv_models[cv_model_name]
        cv_model_options.push(<option key={cv_model['name']} value={cv_model['name']}>{capitalize(cv_model['name'])}</option>)
      }
      var cv_model_suboptions = []
      if (this.state.cv_models[this.state.user_cv_model] !== undefined) {
        for (let cv_suboption of this.state.cv_models[this.state.user_cv_model]['params']) {
          var cv_model_suboptions_items = []
          for (let opt in cv_suboption['mapped_options']) {
            cv_model_suboptions_items.push(<option key={opt} value={cv_suboption['mapped_options'][opt]}>{capitalize(opt)}</option>)
          }
          cv_model_suboptions = cv_model_suboptions.concat([<br/>,
          <br/>,
          <div className="Base-label">
            {cv_suboption['pretty_name']}:
          </div>,
          <select 
            value={this.state.params[cv_suboption['name']]}
            className="Base-select" 
            onChange={(e) => {
              var params = this.state.params
              params[cv_suboption['name']] = e.target.value
              this.setState({params: params})
            }}
          >
            {cv_model_suboptions_items}
          </select>])
        }
      }
      return (
        <div className="Base">
          <div className="Base-title">
            Curriculum Vitae:
          </div>
          <br/>
          <div className="Base-subtitle">
            Header:
          </div>
          <br/>
          {/* PLZ REFACTOR ME */}
          <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="name" mandatory={true} placeholder="Display name"/>
          <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="email" mandatory={true} placeholder="Full email address"/>
          <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="phone" mandatory={false} placeholder="Phone number (e.g. +55 12 3456-7890)"/>
          <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="linkedin" mandatory={false} placeholder="Linkedin url (e.g. linkedin.com/in/youruser/)"/>
          <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="github" mandatory={false} placeholder="GitHub url (e.g. github.com/youruser/)"/>
          <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="homepage" mandatory={false} placeholder="Website address"/>
          <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="address" mandatory={false} placeholder="Phyisical address"/>
          <CvHeaderField stateChanger={this.handleChangeHeader} curriculum={this.props.cv} label="birthday" mandatory={false} placeholder="Birthday date"/>
          <CvItemForm chosenLabel={this.state.chosenLabel} label="Work" cvkey="CvWorkExperienceItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={[["institution", "Name of the institution (e.g. MIT)"], ["role", "Position held (e.g. Software Engineer)"], ["start_date", "Starting date"]]} optFields={[["end_date", "Ending date (leave empty for \"present\")"], ["country", "Country name"], ["state", "State name"], ["city", "City name"], ["description", "Write activities performed at the job(* for items)"]]}/>
          <CvItemForm chosenLabel={this.state.chosenLabel} label="Education" cvkey="CvEducationalExperienceItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={[["institution", "Name of the institution (e.g. MIT)"], ["course", "Name of the course (e.g. Computer Science Bachelor)"], ["start_date", "Starting date"]]} optFields={[["end_date", "Ending date (leave empty for \"present\")"], ["country", "Country name"], ["state", "State name"], ["city", "City name"], ["description", "Write details about the course(* for items)"], ["teacher", "Teacher's name"]]}/>
          <CvItemForm chosenLabel={this.state.chosenLabel} label="Academic Projects" cvkey="CvAcademicProjectItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={[["name", "Project name"], ["start_date", "Starting date"]]} optFields={[["end_date", "Ending date (leave empty for \"present\")"], ["description", "Short description of the project(* for items)"], ["institution", "Name of the institution (e.g. MIT)"], ["country", "Country name"], ["state", "State name"], ["city", "City name"], ["article_link", "Full URL to the article"]]}/>
          <CvItemForm chosenLabel={this.state.chosenLabel} label="Achievements" cvkey="CvAchievementItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel}  fields={[["name", "Achievement name"], ["start_date", "Starting date"]]} optFields={[["end_date", "Ending date (leave empty for \"present\")"], ["description", "Short description of the achievement"], ["institution", "Name of the institution (e.g. MIT)"], ["country", "Country name"], ["state", "State name"], ["city", "City name"], ["place", "Rank obtained (e.g. 1th)"], ["certification_link", "Full URL to the certification"]]}/>
          <CvItemForm chosenLabel={this.state.chosenLabel} label="Projects" cvkey="CvImplementationProjectItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={[["name", "Project name"], ["start_date", "Starting date"]]} optFields={[["end_date", "Ending date (leave empty for \"present\")"], ["description", "Short description of the project(* for items)"], ["language", "Programming language used (e.g. Python)"], ["country", "Country name"], ["state", "State name"], ["city", "City name"], ["repository_link", "Full URL to the repository"]]}/>
          <CvItemForm chosenLabel={this.state.chosenLabel} label="Languages" cvkey="CvLanguageItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={[["language", "Language name (e.g. English)"], ["level", "Level of knowledge (e.g. Advanced)"]]}/>
          <CvItemForm chosenLabel={this.state.chosenLabel} label="Skills" cvkey="CvSkillItem" curriculum={this.props.cv} stateChanger={this.setCv} labelChanger={this.setLabel} fields={[["skill_name", "Skill name"], ["skill_type", "Description of the skill"]]}/>
          {/* YEAH ME ^^^^ */}
          <div className="Base-linemarker"/>
          <div className="Base-subtitle">
            Reorder CV areas:
          </div>
          <br />
          <CvOrder setOrder={({oldIndex, newIndex})=>this.setState({cv_order: arrayMove(this.state.cv_order, oldIndex, newIndex)})} cvOrder={this.state.cv_order}/>
          <br/>
          <div className="Base-label">
            Model:
          </div>
          <select 
            value={this.state.user_cv_model}
            className="Base-select" 
            onChange={(e) => {
              this.setState({user_cv_model: e.target.value, params: this.state.cv_models[e.target.value]['fixed_params']})
            }}
          >
          {cv_model_options}
          </select>
          {cv_model_suboptions}
          <br/>
          <br/>
          <div className="Base-button">
            <a onClick={this.startFilePicker}>
              <input 
                type="file" 
                id="file" 
                ref="fileUploader" 
                onChange={(e) => this.uploadJSON(e.target.files)} style={{display: "none"}}
              />
              Upload Json
            </a>
          </div>
          <div className="Base-button">
            <a onClick={this.downloadCvAsJson}>
              Download Json
            </a>
          </div>
          <div className="Base-button">
            <a onClick={this.downloadCvAsPDF}>
              Download CV
            </a>
          </div>
          {this.props.user !== null ? 
            <div className="Base-button">
              <a onClick={this.saveOnAccount}>
                Save on account
              </a>
            </div> 
          : 
            null
          }
          <br/>
        </div>
      )
    }
 }

export default Builder
