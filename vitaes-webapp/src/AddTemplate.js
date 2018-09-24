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
        </div>
      )
    }
 }

export default AddTemplate
