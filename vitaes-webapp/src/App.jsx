import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import { ToastContainer, toast } from 'react-toastify';
import {
  Navbar, Nav, NavDropdown, Row, Col, Container,
} from 'react-bootstrap';
import About from './About';
import AddTemplate from './AddTemplate';
import Builder from './Builder';
import Login from './Login';
import TemplateHub from './TemplateHub';
import config from './config';
import { getHostname } from './Util';
import { strings } from './i18n/strings';
import 'react-toastify/dist/ReactToastify.css';

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
            toast.warn(msg);
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
        textPromise.then(text => toast.error(`Error:${text}`));
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
      <span>
        <ToastContainer position="bottom-right" />
        <div className="App">
          <script
            src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
            crossOrigin
          />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
            integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
            crossOrigin="anonymous"
          />
          <Navbar collapseOnSelect expand="lg" fixed="top" bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              <img
                alt=""
                src="/mod5.svg"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              {' Vitaes'}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {this.state.hide_options === false
                  ? (
                    <Nav.Link
                      href="#create_cv"
                      onClick={() => {
                        this.setState({ tab: 1 });
                      }}
                    >
                      {strings.createCV}
                    </Nav.Link>
                  ) : null}
                {this.state.user !== null
                  && this.state.permissions !== null
                  && this.state.permissions[this.state.user.uid]
                  ? (
                    <Nav.Link
                      href="#create_template"
                      onClick={() => {
                        this.setState({ tab: 4 });
                      }}
                    >
                      {strings.createTemplate}
                    </Nav.Link>
                  ) : null}
                <Nav.Link
                  href="#hub"
                  onClick={() => {
                    this.setState({ tab: 2 });
                  }}
                >
Template Hub
                </Nav.Link>
                <Nav.Link
                  href="#about"
                  onClick={() => {
                    this.setState({ tab: 3 });
                  }}
                >
                  {strings.aboutTheProject}
                </Nav.Link>
                <NavDropdown title={strings.language} id="basic-nav-dropdown">
                  <NavDropdown.Item href="#lang/en" onClick={() => { strings.setLanguage('en'); this.setState({}); }}>English</NavDropdown.Item>
                  <NavDropdown.Item href="#lang/pt" onClick={() => { strings.setLanguage('pt'); this.setState({}); }}>Português</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav className="mr-sm-2">
                {this.state.user !== null ? (
                  <Nav.Link href="#signout" onClick={this.logout}>{strings.signOut}</Nav.Link>
                ) : (
                  <Nav.Link href="#signin" onClick={() => this.setState({ tab: 0 })}>{strings.signIn}</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Container>
            <Row className="justify-content-md-center">
              <Col>
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
              </Col>
            </Row>
          </Container>
        </div>
      </span>
    );
  }
}

export default App;
