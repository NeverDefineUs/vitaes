import React from 'react';
import firebase from 'firebase';

import getHostname from 'utils/getHostname';

import Builder from './Builder'

const defaultCv = {
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

class BuilderContainer extends React.Component {
  state = {
    cv: defaultCv,
    cv_models: [],
    user: null
  }

  componentDidMount() {
    firebase
      .auth()
      .getRedirectResult()
      .then(() => {
        const user = firebase.auth().currentUser

        this.setState({ user })

        const db = firebase
          .database()
          .ref('cvs')
          .child(user.uid);

        db.on(
          'value',
          (snapshot) => {
            const snap = snapshot.val();
            if (snap === null) {
              db.set(defaultCv);
            } else {
              this.setState({ cv: snap });
            }
          },
          () => {
          },
        );
      })

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
      }
    });
  }

  setCv = (cv) => {
    this.setState({ cv })
  }

  render() {
    return (
      <Builder
        cv_models={this.state.cv_models}
        cv={this.state.cv}
        cvSetter={this.setCv}
        user={this.state.user}
      />
    )
  }
}

export default BuilderContainer;
