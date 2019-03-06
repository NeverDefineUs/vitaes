import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import About from './About';
import AddTemplate from './AddTemplate';
import Builder from './Builder';
import Login from './Login';
import TemplateHub from './TemplateHub';
import config from './config.js';
import { getHostname } from './Util';

firebase.initializeApp(config);

const testCv = {
  CvHeaderItem: {
    name: '',
  },
  CvWorkExperienceItem: [],
  CvAcademicProjectItem: [],
  CvImplementationProjectItem: [],
  CvAchievementItem: [],
  CvEducationalExperienceItem: [],
  CvLanguageItem: [],
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: -1,
      cv: testCv,
      user: null,
      hide_options: true,
      permissions: null,
    };
    this.googleLogin = this.googleLogin.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.githubLogin = this.githubLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.cvSetter = this.cvSetter.bind(this);
    const app = this;
    const dbErrors = firebase.database().ref('errors');
    dbErrors.on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        for (const msg of snapshot.val()) {
          if (msg !== undefined) {
            alert(msg);
          }
        }
      }
    });
    const dbHP = firebase.database().ref('permissions');
    dbHP.on('value', (snapshot) => {
      app.setState({ permissions: snapshot.val() });
    });
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        const user = firebase.auth().currentUser;
        const db = firebase
          .database()
          .ref('cvs')
          .child(user.uid);
        app.setState({ user, tab: 1, hide_options: false });
        db.on(
          'value',
          (snapshot) => {
            const snap = snapshot.val();
            if (snap === null) {
              db.set(testCv);
            } else {
              app.setState({ cv: snap });
            }
          },
          (errorObject) => {
            console.log(errorObject);
          },
        );
      })
      .catch((error) => {
        app.setState({ tab: 0 });
      });

    fetch(`${window.location.protocol}//${getHostname()}/template/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        const jsonPromise = response.json();
        jsonPromise.then((json) => {
          this.setState({ cv_models: json });
        });
      } else {
        const textPromise = response.text();
        textPromise.then(text => alert(`Error:${text}`));
      }
    });
  }

  cvSetter(cv) {
    this.setState({ cv });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  logout() {
    firebase.auth().signOut();
    this.setState({ user: null, tab: 0, hide_options: true });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="/mod5.svg" className="App-icon" alt="" />
          <h1 className="App-title"> Vitaes</h1>
        </header>
        <div className="App-sidenav">
          {this.state.hide_options === false
            ? [
              <a
                onClick={() => {
                  this.setState({ tab: 1 });
                }}
              >
                  Create your CV
              </a>,
            ]
            : null}
          {this.state.user !== null
          && this.state.permissions !== null
          && this.state.permissions[this.state.user.uid] ? (
            <a
              onClick={() => {
                this.setState({ tab: 4 });
              }}
            >
              Create Template
            </a>
            ) : null}
          <a
            onClick={() => {
              this.setState({ tab: 2 });
            }}
          >
            Template Hub
          </a>
          <a
            onClick={() => {
              this.setState({ tab: 3 });
            }}
          >
            About The Project
          </a>
          {this.state.user !== null ? (
            <a onClick={this.logout}>Sign Out</a>
          ) : (
            <a onClick={() => this.setState({ tab: 0 })}>Sign in</a>
          )}
        </div>
        <div className="App-intro">
          {this.state.tab === 0 ? (
            <Login
              skipLogin={() => {
                this.setState({ tab: 1, hide_options: false });
              }}
              googleLogin={this.googleLogin}
              facebookLogin={this.facebookLogin}
              githubLogin={this.githubLogin}
            />
          ) : null}
          {this.state.tab === 1 ? (
            <Builder
              cv_models={this.state.cv_models}
              cv={this.state.cv}
              cvSetter={this.cvSetter}
              user={this.state.user}
            >
              {' '}
            </Builder>
          ) : null}
          {this.state.tab === 2 ? <TemplateHub user={this.state.user} /> : null}
          {this.state.tab === 3 ? <About /> : null}
          {this.state.tab === 4 ? (
            <AddTemplate cv_models={this.state.cv_models} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;
