import React, { Component } from 'react';
import './App.css';
import About from './About';
import AddTemplate from './AddTemplate';
import Builder from './Builder';
import Login from './Login';
import TemplateHub from './TemplateHub';
import firebase from 'firebase';
import config from './config.js';

firebase.initializeApp(config);

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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {tab: -1, cv: testCv, user: null, hide_options: true, permissions: null}
    this.googleLogin = this.googleLogin.bind(this)
    this.googleLogout = this.googleLogout.bind(this)
    this.cvSetter = this.cvSetter.bind(this)
    let app = this
    var dbErrors = firebase.database().ref("errors")
    dbErrors.on("value", function(snapshot) {
      if (snapshot.val() !== null) {
        for (let msg of snapshot.val()) {
          if (msg !== undefined) {
            alert(msg)
          }
        }
      }
    })
    var dbHP = firebase.database().ref("permissions")
    dbHP.on("value", function(snapshot) {
      app.setState({permissions: snapshot.val()})
      console.log(snapshot.val())
    })
    firebase.auth().getRedirectResult().then(function(result) {
      var user = firebase.auth().currentUser
      var db = firebase.database().ref("cvs").child(user.uid)
      app.setState({user: user, tab: 1, hide_options: false})
      console.log(user)
      db.on("value", function(snapshot) {
        var snap = snapshot.val()
        if (snap === null) {
          db.set(testCv)
        } else {
          app.setState({cv: snap})
        }
      }, function (errorObject) {
        console.log(errorObject)
      })
    }).catch(function(error) {
      app.setState({tab: 0})
    })
  }

  cvSetter(cv) {
    console.log(cv)
    
    this.setState({cv: cv})
    console.log(this.state.cv)
  }

  googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }

  googleLogout() {
    firebase.auth().signOut()
    this.setState({user: null, tab: 0, hide_options: true})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <img src="/mod5.svg" className="App-icon" alt=""/><h1 className="App-title">  Vitaes</h1>
        </header>
        <div className="App-sidenav">
          {this.state.hide_options === false ?
          [
            <a onClick={() => { this.setState({tab: 1}) }}>Create your CV</a>,
          ]
          : null}
          {this.state.user !== null && this.state.permissions !== null && this.state.permissions[this.state.user.uid] ?
            <a onClick={() => {this.setState({tab: 4})}}>Create Template</a>
          : null}
          <a onClick={() => { this.setState({tab: 2}) }}>Template Hub</a>
          <a onClick={() => { this.setState({tab: 3}) }}>About The Project</a>
          {this.state.user !== null ?
            <a onClick={this.googleLogout}>Sign Out</a>
          : <a onClick={() => this.setState({tab: 0})}>Sign in</a>}
        </div>
        <div className="App-intro">
          { this.state.tab === 0 ? <Login skipLogin={() => {this.setState({tab: 1, hide_options: false})}} googleLogin={this.googleLogin} /> : null}
          { this.state.tab === 1 ? <Builder cv={this.state.cv} cvSetter={this.cvSetter} user={this.state.user}> </Builder> : null }
          { this.state.tab === 2 ? <TemplateHub user={this.state.user} /> : null}
          { this.state.tab === 3 ? <About /> : null}
          { this.state.tab === 4 ? <AddTemplate /> : null}
        </div>
      </div>
    );
  }
}

export default App;
