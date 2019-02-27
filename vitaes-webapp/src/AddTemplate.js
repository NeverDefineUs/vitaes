import React, { Component } from 'react'
import firebase from 'firebase'

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

class AddTemplate extends Component {
    constructor(){
      super()
      this.state = {template: {command: "", name: "", params: {}, fixed_params:{}}}
    }
    render() {
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
              this.setState({template: {owner: firebase.auth().currentUser.uid, command: "", likes: 0, name: "", params: {}, fixed_params:{}}})}}
              >
              Submit
            </a>
          </div>
          <div className="Base-button">
            <a onClick={()=>{}}>
              Add New Param
            </a>
          </div>  
        </div>
      )
    }
 }

export default AddTemplate
