import React from 'react';
import firebase from 'firebase';
import { ToastContainer, toast } from 'react-toastify';

import { translate } from 'i18n/locale';
import getHostname from 'utils/getHostname';

import Builder from './Builder';

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
  constructor(props) {
    super(props);
    this.state = {
      cv: defaultCv,
      cv_models: [],
      user: null,
    };

    this.setCv = this.setCv.bind(this);
  }

  componentDidMount() {
    firebase
      .auth()
      .getRedirectResult()
      .then(() => {
        const user = firebase.auth().currentUser;

        this.setState({ user });
        if (user) {
          const loadingToast = toast.info(`${translate('loading')}...`, { autoClose: false });

          const db = firebase
            .database()
            .ref('cvs')
            .child(user.uid);

          db.on(
            'value',
            (snapshot) => {
              toast.dismiss(loadingToast);
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
        }
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
        textPromise.then(text => toast.error(`${translate('error')}: ${text}`));
      }
    });
  }

  setCv(cv) {
    this.setState({ cv });
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer position="bottom-right" />
        <Builder
          cv_models={this.state.cv_models}
          cv={this.state.cv}
          cvSetter={this.setCv}
          user={this.state.user}
        />
      </React.Fragment>
    );
  }
}

export default BuilderContainer;
