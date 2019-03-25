import React, { Component } from 'react';
import firebase from 'firebase';
import arrayMove from 'array-move';
import fetch from 'fetch-retry';
import { toast } from 'react-toastify';
import _ from 'lodash';
import {
  Button, Form, Card, Col, Row,
} from 'react-bootstrap';

import BugReporter from 'BugReporter';
import { translate, getActiveLocale } from 'i18n/locale';
import capitalize from 'utils/capitalize';
import getHostname from 'utils/getHostname';
import removeDisabled from 'utils/removeDisabled';
import validateEmail from 'utils/validateEmail';
import validateDate from 'utils/validateDate';

import CvOrder from './CvOrder';
import CvHeaderField from './CvHeaderField';
import CvItemForm from './CvItemForm';
import headerFields from './headerFields';
import { cvFormFields, updateFormFields } from './cvFormFields';

class Builder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloading: false,
      showBugUi: false,
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
    if (this.state.downloading) {
      return;
    }
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

    const cv = removeDisabled(this.props.cv);
    // TODO this should be receiving full locale
    this.state.params.lang = getActiveLocale();
    this.setState({ downloading: true });
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
        const saveOn = (path) => {
          const db = firebase
            .database()
            .ref(path)
            .child(
              `EMAIL:${
                this.props.user !== null
                  ? this.props.user.uid
                  : this.props.cv.CvHeaderItem.email.replace(/\./g, '_dot_')}`,
            )
            .push();
          db.set(this.props.cv);
        };
        const idPromise = response.text();
        toast(`${translate('loading')}...`, { autoClose: false, toastId: 'downloading' });
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
              saveOn('cv-dumps');
              const fileBlob = cvresponse.blob();
              fileBlob.then((file) => {
                const element = document.createElement('a');
                element.href = URL.createObjectURL(file);
                element.download = 'cv.pdf';
                element.click();
              });
              toast.update('downloading', { render: `${translate('ready')}!`, autoClose: 5000, type: toast.TYPE.INFO });
              this.setState({ downloading: false });
            } else {
              saveOn('cv-errors');
              toast.update('downloading', { render: translate('error_processing_file'), autoClose: 5000, type: toast.TYPE.ERROR });
              this.setState({ downloading: false });
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
    updateFormFields();
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
          <Button
            variant="secondary"
            style={{ float: 'right' }}
            sm="2"
            onClick={() => this.setState({ showBugUi: true })}
          >
            {translate('report_a_bug')}
          </Button>
          <h2>Curriculum Vitae:</h2>
          <br />
          <h3>
            {translate('header')}
            :
          </h3>
          <br />
          <Form>
            {_.map(headerFields, field => (
              <CvHeaderField
                stateChanger={this.handleChangeHeader}
                curriculum={this.props.cv}
                label={field.label}
                id={field.id}
                mandatory={field.mandatory}
                placeholder={field.placeholder}
              />
            ))
            }
          </Form>
          {_.map(cvFormFields, form => (
            <CvItemForm
              chosenLabel={this.state.chosenLabel}
              label={form.label}
              cvkey={form.cvkey}
              curriculum={this.props.cv}
              stateChanger={this.setCv}
              labelChanger={this.setLabel}
              fields={form.fields}
              optFields={form.optFields}
            />
          ))
          }
          <hr />
          <h3>
            {`${translate('reorder_cvareas')}:`}
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
            disabled={this.state.downloading}
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
        <BugReporter
          show={this.state.showBugUi}
          data={{
            cv: this.props.cv,
            user_cv_model: this.state.user_cv_model,
            params: this.state.params,
            cv_order: this.state.cv_order,
            lang: getActiveLocale(),
          }}
          onHide={() => this.setState({ showBugUi: false })}
        />
      </Card>
    );
  }
}

export default Builder;
