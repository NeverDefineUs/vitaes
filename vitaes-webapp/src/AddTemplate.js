import React, { Component } from 'react'
import firebase from 'firebase'
import { getHostname } from './Util';

class TemplateField extends Component {
  // label, placeholder, value, callback
  render() {
    return (
      <div className="Base-field">
        <div className="Base-label">
          {this.props.label}:
        </div>
        <input 
          type="text"
          name={this.props.label}
          value={this.props.value}
          className="Base-inputfield"
          placeholder={this.props.placeholder}
          onChange={this.props.callback}
        />
      </div>
    )
  }
}

class OwnedTemplate extends Component {
  render() {
    return (<div className="Base-item">
       {this.props.template.name}
        <div className="Base-item-close">
        <input type="file" ref="fileUploader" style={{display: "none"}} onInput={(event)=>{
            let files = event.target.files
            if (files.length === 1 && files[0].name.substr(files[0].name.length - 4, 4) == ".zip"){
              const file = files[0]
              console.log(file)
              let form = new FormData()
              form.append('file', file)

              fetch(window.location.protocol + '//' + getHostname() + '/template/files/' + this.props.template.name + '/', {
                method: 'POST',
                body: form
              }).then(response => {
                if (!response.ok) {
                  var textPromise = response.text()
                  textPromise.then(text => alert("Error:" + text))
                }
              })
            }
          }}/>
          <a onClick={()=>{
            let base_folder = this.props.template.base_folder
            if(base_folder === undefined || base_folder.substr(0,6) == "mongo:") {
              this.refs.fileUploader.click();
            }
          }}>
            Upload zip
          </a>
        </div> 
      </div>)
  }
}

class AddTemplate extends Component {
    constructor(){
      super()
      this.state = {template: {owner: firebase.auth().currentUser.uid, command: "", data: {likes: 0}, name: "", params: {}, fixed_params:{}}}
    }
    render() {
      var owned_cvs = []

      for(let cv_key in this.props.cv_models){
        let template = this.props.cv_models[cv_key]
        if(template.owner === firebase.auth().currentUser.uid){
          owned_cvs.push(<OwnedTemplate template={template} key={cv_key}/>)
        }
      }

      return (
        <div className="Base">
          <div className="Base-title">
            Create a template:
          </div>
          <TemplateField placeholder="awesome" label="Name" value={this.state.name} callback={(e) => {let template = this.state.template;template["name"] = e.target.value;this.setState({"template": template})}}/>
          <TemplateField placeholder="pdflatex" label="Command" value={this.state.command} callback={(e) => {let template = this.state.template;template["command"] = e.target.value;this.setState({"template": template})}}/>
          <div className="Base-subtitle">
            Params:
          </div>
          <div className="Base-button">
            <a onClick={()=>{
              fetch("http://localhost:5000/template/", {method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.template)}); 
              this.setState({template: {owner: firebase.auth().currentUser.uid, command: "", data: {likes: 0}, name: "", params: {}, fixed_params:{}}})}}
              >
              Submit
            </a>
          </div>
          <div className="Base-button">
            <a onClick={()=>{}}>
              Add New Param
            </a>
          </div>  
          <div className="Base-linemarker" style={{marginTop: "3em"}}/>
          {owned_cvs}
        </div>
      )
    }
 }

export default AddTemplate
