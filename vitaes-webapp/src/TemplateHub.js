import React, { Component } from 'react'
import './Builder.css'
import './TemplateHub.css'
import {capitalize} from './Util'

class TemplateHubModel extends Component {
  constructor(props) {
    super(props)
    this.hostname = window.location.hostname + ':5000'
    if (this.hostname === 'vitaes.io:5000') {
      this.hostname = 'renderer.vitaes.io'
    }
  }
  render(){
    let model = this.props.model
    console.log(model)
    var parameters = []
    for (let val of model['params']) {
      parameters.push(<div>{capitalize(val['pretty_name'])}</div>)
      let paramOptions = []
      for (let opt in val['mapped_options']) {
        paramOptions.push(<li>{opt}</li>)
      }
      parameters.push(<ul>{paramOptions}</ul>)
    }
    return (
      <div>
        <div className="template-title-bar">
          <div className="template-name">{capitalize(this.props.keyName)}</div>
          <div className='template-linemark'></div>
        </div>
        <div className="template-info">
          <img className="template-image" src="https://imgur.com/download/qwvtvlj"></img>
          <div className="template-button" onClick={() => {
            fetch( window.location.protocol + '//' + this.hostname + '/template/like/', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({"uid": this.props.user, "templatename": this.props.keyName})
            }).then(response => {

            })
          }}>
            <a><img src="/Ei-heart.svg"></img><span>{model['data']['likes']}</span></a>
          </div>
        </div>
        
      </div>
    ) 
  }
}

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
        templateList.push(<TemplateHubModel user={this.props.user} keyName={key} model={this.state.cv_models[key]} />)
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
