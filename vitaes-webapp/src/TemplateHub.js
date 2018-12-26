import React, { Component } from 'react'
import './Builder.css'

class TemplateHub extends Component {
    
  constructor(props) {
    super(props)
    this.state = {cv_models: {}}
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

  render() {
      var templateList = []
      for (let key in this.state.cv_models) {
        console.log(this.state.cv_models[key])
        templateList.push(<div>{key}</div>)
      }
      return (
        <div className="Base">
          <div className="Base-title">
            Template Hub
          </div>
          {templateList}
          <br/>
          
        </div>
      )
    }
 }

export default TemplateHub
