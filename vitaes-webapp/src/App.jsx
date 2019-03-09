import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import About from './About';
import AddTemplate from './AddTemplate';
import Builder from './Builder';
import Login from './Login';
import TemplateHub from './TemplateHub';
import config from './config';
import { getHostname, titleCase } from './Util';
import { strings } from './i18n/localization';

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
      .then(() => {
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
          () => {
          },
        );
      })
      .catch(() => {
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
                {strings.createCV}
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
              {titleCase(strings.createTemplate)}
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
            {titleCase(strings.aboutTheProject)}
          </a>
          {this.state.user !== null ? (
            <a onClick={this.logout}>{strings.signOut}</a>
          ) : (
            <a onClick={() => this.setState({ tab: 0 })}>{strings.signIn}</a>
          )}
        </div>
        <div className="App-intro">
          {this.state.tab === 0 ? (
            <Login
              skipLogin={() => {
                this.setState({ tab: 1, hide_options: false });
              }}
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
