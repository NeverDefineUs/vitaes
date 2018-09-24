import React, { Component } from 'react'
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
      this.state = {template: {command: "pdflatex", name: "", params: {}, fixed_params:{}}}
    }
    render() {
      return (
        <div className="Base">
          <div className="Base-title">
            Create a template:
          </div>
          <TemplateField placeholder="awesome" label="Name" value={this.state.name} callback={(e) => {let template = this.state.template;template["name"] = e.target.value;this.setState({"template": template})}}/>
          <TemplateField placeholder="pdflatex" label="Command" value={this.state.command} callback={(e) => {let template = this.state.template;template["command"] = e.target.value;this.setState({"template": template})}}/>
        </div>
      )
    }
 }

export default AddTemplate
