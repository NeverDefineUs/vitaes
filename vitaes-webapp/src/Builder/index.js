import React from 'react';
import firebase from 'firebase';
import { toast } from 'react-toastify';

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

const defaultUser = {
  cv: defaultCv,
  user_cv_model: 'awesome', 
  params: {},
  autoSave: false,
  cv_order: [
    'work',
    'education',
    'achievement',
    'project',
    'academic',
    'language',
    'skill',
  ]
}

class BuilderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: defaultUser,
      cv_models: [],
      user: null,
    };

    this.setUserData = this.setUserData.bind(this);
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
            .ref('users')
            .child(user.uid);

          db.on(
            'value',
            (snapshot) => {
              toast.dismiss(loadingToast);
              const snap = snapshot.val();
              if (snap === null) {
                db.set(defaultUser);
              } else {
                this.setState({ userData: snap });
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

  setUserData(userData) {
    this.setState({ userData });
  }

  render() {
    return (
      <React.Fragment>
        <Builder
          cv_models={this.state.cv_models}
          user={this.state.user}
          userData={this.state.userData}
          userDataSetter={this.setUserData}
        />
      </React.Fragment>
    );
  }
}

export default BuilderContainer;
