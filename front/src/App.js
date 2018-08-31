import React, { Component } from 'react';
import './App.css';
import Builder from './Builder';
import firebase from 'firebase';

var config = {
}

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
    this.state = {tab: 1, cv: testCv, user: null}
    this.googleLogin = this.googleLogin.bind(this)
    this.googleLogout = this.googleLogout.bind(this)
    this.cvSetter = this.cvSetter.bind(this)
    let app = this
    firebase.auth().getRedirectResult().then(function(result) {
      var user = firebase.auth().currentUser
      var db = firebase.database().ref("cvs").child(user.uid)
      app.setState({user: user})
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
    this.setState({user: null})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to CVCS</h1>
        </header>
        <div className="App-sidenav">
          <a onClick={() => { this.setState({tab: 1}) }}>Test Me</a>
          {this.state.user === null ?
          <a onClick={this.googleLogin}>Google Login</a> :
          <a onClick={this.googleLogout}>Google Logout</a>}
          <a href="https://github.com/Arthurlpgc/CVCS" onClick={() => { this.setState({tab: 3}) }}>About The Project</a>
        </div>
        <div className="App-intro">
          { this.state.tab === 1 ? <Builder cv={this.state.cv} cvSetter={this.cvSetter} user={this.state.user}> </Builder> : null }
        </div>
      </div>
    );
  }
}

export default App;
