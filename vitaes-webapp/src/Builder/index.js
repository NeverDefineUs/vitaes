import React, { Component } from 'react';
import firebase from 'firebase';
import { arrayMove } from 'react-sortable-hoc';
import fetch from 'fetch-retry';
import { toast } from 'react-toastify';
import {
  Button, Form, Card, Col, Row,
} from 'react-bootstrap';

import { translate } from 'i18n/locale';
import capitalize from 'utils/capitalize';
import getHostname from 'utils/getHostname';
import removeDisabled from 'utils/removeDisabled';
import validateEmail from 'utils/validateEmail';
import validateDate from 'utils/validateDate';

import CvOrder from './CvOrder';
import { fieldsDef, updateFields } from './shared/fields';
import CvHeaderField from './CvHeaderField';
import CvItemForm from './CvItemForm';


class Builder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenLabel: '',
      user_cv_model: 'awesome',
      cv_order: [
        'work',
        'education',
        'achievement',
        'project',
        'academic',
        'language',
        'skill',
      ],
      params: {},
    };
    this.handleChangeHeader = this.handleChangeHeader.bind(this);
    this.downloadCvAsJson = this.downloadCvAsJson.bind(this);
    this.downloadCvAsPDF = this.downloadCvAsPDF.bind(this);
    this.saveOnAccount = this.saveOnAccount.bind(this);
    this.setCv = this.setCv.bind(this);
    this.setLabel = this.setLabel.bind(this);
    this.startFilePicker = this.startFilePicker.bind(this);
    this.uploadJSON = this.uploadJSON.bind(this);
  }

  setCv(cv) {
    this.props.cvSetter(cv);
  }

  setLabel(label) {
    this.setState({ chosenLabel: label });
  }

  downloadCvAsJson() {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(this.props.cv)], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'cv.json';
    element.click();
  }

  downloadCvAsPDF() {
    if (!validateEmail(this.props.cv.CvHeaderItem.email)) {
      toast.error(translate('invalid_email_format'));
      return;
    }
    if (this.props.cv.CvHeaderItem.name === '') {
      toast.error(translate('invalid_name_format'));
      return;
    }
    if (this.props.cv.CvHeaderItem.birthday) {
      if (!validateDate(this.props.cv.CvHeaderItem.birthday)) {
        toast.error(translate('invalid_birthday_format'));
        return;
      }
    }

    const db = firebase
      .database()
      .ref('cv-dumps')
      .child(
        `EMAIL:${
          this.props.user !== null
            ? this.props.user.uid
            : this.props.cv.CvHeaderItem.email.replace(/\./g, '_dot_')}`,
      )
      .push();
    db.set(this.props.cv);
    const cv = removeDisabled(this.props.cv);
    fetch(`${window.location.protocol}//${getHostname()}/cv/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        curriculum_vitae: cv,
        section_order: this.state.cv_order,
        render_key: this.state.user_cv_model,
        params: this.state.params,
      }),
    }).then((response) => {
      if (response.ok) {
        const idPromise = response.text();
        idPromise.then((id) => {
          fetch(
            `${window.location.protocol}//${getHostname()}/cv/${id}/`,
            {
              method: 'GET',
              retries: 20,
              retryDelay: 1000,
              retryOn: [404],
            },
          ).then((cvresponse) => {
            if (cvresponse.ok) {
              const fileBlob = cvresponse.blob();
              fileBlob.then((file) => {
                const element = document.createElement('a');
                element.href = URL.createObjectURL(file);
                element.download = 'cv.pdf';
                element.click();
              });
            } else {
              toast.error(translate('error_processing_file'));
            }
          });
        });
      } else {
        const textPromise = response.text();
        textPromise.then(text => toast.error(`${translate('error')}: ${text}`));
      }
    });
  }

  saveOnAccount() {
    const { user } = this.props;
    if (user !== null) {
      const db = firebase
        .database()
        .ref('cvs')
        .child(user.uid);
      db.set(this.props.cv);
    }
  }

  handleChangeHeader(event) {
    const aux = this.props.cv;
    aux.CvHeaderItem[event.target.name] = event.target.value;
    if (aux.CvHeaderItem[event.target.name] === '') {
      delete aux.CvHeaderItem[event.target.name];
    }
    this.setCv(aux);
  }

  startFilePicker() {
    this.fileUploader.click();
  }

  uploadJSON(selectorFiles) {
    const fr = new FileReader();
    // eslint-disable-next-line func-names
    fr.onload = function () {
      const json = fr.result;
      this.setCv(JSON.parse(json));
    }.bind(this);
    fr.readAsText(selectorFiles[0]);
  }

  render() {
    updateFields();
    const cvModelOptions = [];
    for (const cvModelName in this.props.cv_models) {
      const cvModel = this.props.cv_models[cvModelName];
      cvModelOptions.push(
        <option key={cvModel.name} value={cvModel.name}>
          {capitalize(cvModel.name)}
        </option>,
      );
    }
    const cvModelSuboptions = [];
    if (this.props.cv_models !== undefined
      && this.props.cv_models[this.state.user_cv_model] !== undefined) {
      for (const cvSuboption of this.props.cv_models[this.state.user_cv_model].params) {
        const cvModelSuboptionsItems = [];
        for (const opt in cvSuboption.mapped_options) {
          cvModelSuboptionsItems.push(
            <option key={opt} value={cvSuboption.mapped_options[opt]}>
              {capitalize(opt)}
            </option>,
          );
        }
        cvModelSuboptions.push(
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              {cvSuboption.pretty_name}
              :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="select"
                value={this.state.params[cvSuboption.name]}
                onChange={(e) => {
                  const { params } = this.state;
                  params[cvSuboption.name] = e.target.value;
                  this.setState({ params });
                }}
              >
                {cvModelSuboptionsItems}
              </Form.Control>
            </Col>
          </Form.Group>,
        );
      }
    }
    return (
      <Card bg="light">
        <Card.Body>
          <h2>Curriculum Vitae:</h2>
          <br />
          <h3>
            {translate('header')}
            :
          </h3>
          <br />
          <Form>
            <CvHeaderField
              stateChanger={this.handleChangeHeader}
              curriculum={this.props.cv}
              label={translate('name')}
              id="name"
              mandatory
              placeholder={translate('name_placeholder')}
            />
            <CvHeaderField
              stateChanger={this.handleChangeHeader}
              curriculum={this.props.cv}
              label={translate('email')}
              id="email"
              mandatory
              placeholder={translate('email_placeholder')}
            />
            <CvHeaderField
              stateChanger={this.handleChangeHeader}
              curriculum={this.props.cv}
              label="linkedin"
              id="linkedin"
              mandatory={false}
              placeholder={translate('linkedin_placeholder')}
            />
            <CvHeaderField
              stateChanger={this.handleChangeHeader}
              curriculum={this.props.cv}
              label={translate('homepage')}
              id="homepage"
              mandatory={false}
              placeholder={translate('homepage_placeholder')}
            />
            <CvHeaderField
              stateChanger={this.handleChangeHeader}
              curriculum={this.props.cv}
              label="github"
              id="github"
              mandatory={false}
              placeholder={translate('github_placeholder')}
            />
            <CvHeaderField
              stateChanger={this.handleChangeHeader}
              curriculum={this.props.cv}
              label={translate('phone')}
              id="phone"
              mandatory={false}
              placeholder={translate('phone_placeholder')}
            />
            <CvHeaderField
              stateChanger={this.handleChangeHeader}
              curriculum={this.props.cv}
              label={translate('birthday')}
              id="birthday"
              mandatory={false}
              placeholder={translate('date_format')}
            />
            <CvHeaderField
              stateChanger={this.handleChangeHeader}
              curriculum={this.props.cv}
              label={translate('address')}
              id="address"
              mandatory={false}
              placeholder={translate('address_placeholder')}
            />
          </Form>
          <CvItemForm
            chosenLabel={this.state.chosenLabel}
            label={translate('work')}
            cvkey="CvWorkExperienceItem"
            curriculum={this.props.cv}
            stateChanger={this.setCv}
            labelChanger={this.setLabel}
            fields={[
              fieldsDef.institution,
              fieldsDef.role,
              fieldsDef.startDate,
            ]}
            optFields={[
              fieldsDef.endDate,
              fieldsDef.country,
              fieldsDef.state,
              fieldsDef.city,
              fieldsDef.jobDescription,
            ]}
          />
          <CvItemForm
            chosenLabel={this.state.chosenLabel}
            label={translate('education')}
            cvkey="CvEducationalExperienceItem"
            curriculum={this.props.cv}
            stateChanger={this.setCv}
            labelChanger={this.setLabel}
            fields={[
              fieldsDef.institution,
              fieldsDef.course,
              fieldsDef.startDate,
            ]}
            optFields={[
              fieldsDef.endDate,
              fieldsDef.country,
              fieldsDef.state,
              fieldsDef.city,
              fieldsDef.teacher,
              fieldsDef.courseDescription,
            ]}
          />
          <CvItemForm
            chosenLabel={this.state.chosenLabel}
            label={translate('academic')}
            cvkey="CvAcademicProjectItem"
            curriculum={this.props.cv}
            stateChanger={this.setCv}
            labelChanger={this.setLabel}
            fields={[fieldsDef.projectName, fieldsDef.startDate]}
            optFields={[
              fieldsDef.endDate,
              fieldsDef.institution,
              fieldsDef.country,
              fieldsDef.state,
              fieldsDef.city,
              fieldsDef.articleLink,
              fieldsDef.projectDescription,
            ]}
          />
          <CvItemForm
            chosenLabel={this.state.chosenLabel}
            label={translate('achievements')}
            cvkey="CvAchievementItem"
            curriculum={this.props.cv}
            stateChanger={this.setCv}
            labelChanger={this.setLabel}
            fields={[
              fieldsDef.achievementName,
              fieldsDef.startDate,
            ]}
            optFields={[
              fieldsDef.endDate,
              fieldsDef.institution,
              fieldsDef.country,
              fieldsDef.state,
              fieldsDef.city,
              fieldsDef.place,
              fieldsDef.certificateLink,
              fieldsDef.achievementDescription,
            ]}
          />
          <CvItemForm
            chosenLabel={this.state.chosenLabel}
            label={translate('projects')}
            cvkey="CvImplementationProjectItem"
            curriculum={this.props.cv}
            stateChanger={this.setCv}
            labelChanger={this.setLabel}
            fields={[fieldsDef.projectName, fieldsDef.startDate]}
            optFields={[
              fieldsDef.endDate,
              fieldsDef.programLanguage,
              fieldsDef.country,
              fieldsDef.state,
              fieldsDef.city,
              fieldsDef.repositoryLink,
              fieldsDef.projectDescription,
            ]}
          />
          <CvItemForm
            chosenLabel={this.state.chosenLabel}
            label={translate('languages')}
            cvkey="CvLanguageItem"
            curriculum={this.props.cv}
            stateChanger={this.setCv}
            labelChanger={this.setLabel}
            fields={[
              fieldsDef.language,
              fieldsDef.languageLevel,
            ]}
          />
          <CvItemForm
            chosenLabel={this.state.chosenLabel}
            label={translate('skills')}
            cvkey="CvSkillItem"
            curriculum={this.props.cv}
            stateChanger={this.setCv}
            labelChanger={this.setLabel}
            fields={[
              fieldsDef.skillName,
              fieldsDef.skillType,
            ]}
          />
          <hr />
          <h3>
            {translate('reorder_cvareas')}
            :
          </h3>
          <br />
          <CvOrder
            setOrder={({ oldIndex, newIndex }) => this.setState({
              cv_order: arrayMove(this.state.cv_order, oldIndex, newIndex),
            })
            }
            cvOrder={this.state.cv_order}
          />
          <br />
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              {translate('model')}
              :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="select"
                value={this.state.user_cv_model}
                onChange={(e) => {
                  this.setState({
                    user_cv_model: e.target.value,
                    params: this.props.cv_models[e.target.value].fixed_params,
                  });
                }}
              >
                {cvModelOptions}
              </Form.Control>
            </Col>
          </Form.Group>
          {cvModelSuboptions}
          <br />
          <br />
          <Button
            variant="secondary"
            size="sm"
            onClick={this.startFilePicker}
            style={{ marginLeft: 5, float: 'right' }}
          >
            <input
              type="file"
              id="file"
              ref={(fp) => { this.fileUploader = fp; }}
              onChange={e => this.uploadJSON(e.target.files)}
              style={{ display: 'none' }}
            />
            {translate('upload_json')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={this.downloadCvAsJson}
            style={{ marginLeft: 5, float: 'right' }}
          >
            {translate('download_json')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={this.downloadCvAsPDF}
            style={{ marginLeft: 5, float: 'right' }}
          >
            {translate('download_cv')}
          </Button>
          {this.props.user !== null ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={this.saveOnAccount}
              style={{ marginLeft: 5, float: 'right' }}
            >
              {translate('save_cv_on_account')}
            </Button>
          ) : null}
        </Card.Body>
      </Card>
    );
  }
}

export default Builder;
