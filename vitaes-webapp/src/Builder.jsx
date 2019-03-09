/* eslint-disable */

import React, { Component } from 'react';
import './Builder.css';
import firebase from 'firebase';
import TextareaAutosize from 'react-autosize-textarea';
import { arrayMove } from 'react-sortable-hoc';
import fetch from 'fetch-retry';
import { capitalize, getHostname, removeDisabled, validateEmail, validateDate } from './Util';
import CvOrder from './CvOrder';
import { strings } from './i18n/strings';
import { fieldsDef } from './fields';
import { toast } from 'react-toastify';

const locFields = [
  fieldsDef.country,
  fieldsDef.state,
  fieldsDef.city,
];

class CvHeaderField extends Component {
  // label, id, placeholder, mandatory, curriculum, stateChanger
  render() {
    return (
      <div className="Base-field">
        <div className="Base-label">
          {capitalize(this.props.label)}
          {this.props.mandatory ? ' (' + strings.required + ')' : ''}
          {this.props.id === 'birthday' ? ' [YYYY-MM-DD]' : ''}
:
        </div>
        <input
          type="text"
          name={this.props.id}
          value={
            this.props.curriculum.CvHeaderItem[this.props.id]
            === undefined
              ? ''
              : this.props.curriculum.CvHeaderItem[this.props.id]
          }
          className="Base-inputfield"
          placeholder={this.props.placeholder}
          onChange={this.props.stateChanger}
        />
      </div>
    );
  }
}

class CvField extends Component {
  // label, id, placeholder, mandatory, toAdd, stateChanger, addField
  render() {
    let inputField;
    if (this.props.label !== 'description') {
      inputField = (
        <input
          type="text"
          name={this.props.id}
          value={
            this.props.toAdd[this.props.id] === undefined
              ? ''
              : this.props.toAdd[this.props.id]
          }
          className="Base-inputfield"
          onChange={this.props.stateChanger}
          placeholder={this.props.placeholder}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.props.addField();
            }
          }}
        />
      );
    } else {
      inputField = (
        <TextareaAutosize
          type="text"
          name={this.props.id}
          value={
            this.props.toAdd[this.props.id] === undefined
              ? ''
              : this.props.toAdd[this.props.id]
          }
          className="Base-textareafield"
          onChange={this.props.stateChanger}
          placeholder={this.props.placeholder}
          rows={1}
        />
      );
    }

    return (
      <div className="Base-field">
        <div className="Base-label">
          {capitalize(this.props.label)}
          {this.props.mandatory ? ' (' + strings.required + ')' : ''}
          {this.props.id.endsWith('date') ? ' [YYYY-MM-DD]' : ''}
:
        </div>
        {inputField}
      </div>
    );
  }
}

class CvItemForm extends Component {
  // label, chosenLabel, curriculum, cvkey, stateChanger, fields, optFields, labelChanger
  constructor(props) {
    super(props);
    this.getEventDeleter = this.getEventDeleter.bind(this);
    this.getEventExpander = this.getEventExpander.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addField = this.addField.bind(this);
    this.state = { toAdd: {} };
  }

  getEventDeleter(index) {
    return () => {
      const cv = this.props.curriculum;
      cv[this.props.cvkey].splice(index, 1);
      this.props.stateChanger(cv);
    };
  }

  getEventEnabler(index) {
    return () => {
      const cv = this.props.curriculum;
      if (cv[this.props.cvkey][index].disable === undefined) {
        cv[this.props.cvkey][index].disable = false;
      }
      cv[this.props.cvkey][index].disable = !cv[this.props.cvkey][index]
        .disable;
      this.props.stateChanger(cv);
    };
  }

  getEventExpander(index) {
    return () => {
      if (this.props.label === this.props.chosenLabel) {
        if (!this.addField()) {
          return;
        }
      }
      const cv = this.props.curriculum;
      const toAdd = cv[this.props.cvkey][index];
      cv[this.props.cvkey].splice(index, 1);
      this.props.stateChanger(cv);
      if (toAdd.institution !== undefined) {
        toAdd.institution = toAdd.institution.CvInstitution.name;
      }
      if (toAdd.location !== undefined) {
        for (const locField of locFields) {
          if (toAdd.location.CvLocation[locField] !== undefined) {
            toAdd[locField] = toAdd.location.CvLocation[locField];
          }
        }
        delete toAdd.location;
      }
      this.setState({ toAdd });
      this.props.labelChanger(this.props.label);
    };
  }

  handleChange(event) {
    const aux = this.state.toAdd;
    aux[event.target.name] = event.target.value;
    if (aux[event.target.name] === '') {
      delete aux[event.target.name];
    }
    this.setState({ toAdd: aux });
  }

  addField() {
    const cv = this.props.curriculum;
    const { toAdd } = this.state;
    for (const item of this.props.fields) {
      if (toAdd[item[0]] === undefined) {
        if (item[0] === 'name') {
          toast.error('Needed Field: Title');
        } else {
          toast.error(`Needed Field: ${capitalize(item[0])}`);
        }
        return false;
      }
    }
    for (const item in toAdd) {
      if (item.endsWith('date') && toAdd[item]) {
        if (!toAdd[item].match(/^\d{4}-\d{2}-\d{2}$/)) {
          toast.error(`Wrong format:${item}`);
          return false;
        }
      }
    }
    if (toAdd.institution !== undefined) {
      const institution = { CvInstitution: { name: toAdd.institution } };
      toAdd.institution = institution;
    }
    if (
      toAdd.country !== undefined
      || toAdd.state !== undefined
      || toAdd.city !== undefined
    ) {
      const cvLocation = {};
      for (var locField of locFields) {
        if (toAdd[locField[0]] !== undefined) {
          cvLocation[locField[0]] = toAdd[locField[0]];
        }
      }
      toAdd.location = { CvLocation: cvLocation };
      for (locField of locFields) {
        delete toAdd[locField[0]];
      }
    }
    if (cv[this.props.cvkey] === undefined) {
      cv[this.props.cvkey] = [];
    }
    cv[this.props.cvkey].push(toAdd);
    this.props.stateChanger(cv);
    this.setState({ toAdd: {} });
    this.props.labelChanger('');
    return true;
  }

  render() {
    const nodes = [
      <div className="Base-linemarker" key={-3} />,
      <div className="Base-subtitle" key={-2}>
        {this.props.label}
:
      </div>,
      <br key={-1} />,
    ];
    const comp = this;
    if (this.props.curriculum[this.props.cvkey] !== undefined) {
      this.props.curriculum[this.props.cvkey].forEach((item, index) => {
        let name = '';
        if (item.name !== undefined) {
          name = item.name;
        } else if (item.institution !== undefined) {
          name = item.institution.CvInstitution.name;
        } else if (item.language !== undefined) {
          name = item.language;
        } else {
          name = `${item.skill_type}: ${item.skill_name}`;
        }
        nodes.push(
          <div className="Base-item" key={index}>
            <span onClick={comp.getEventExpander(index)}>{name}</span>
            <div
              className="Base-item-close"
              onClick={comp.getEventDeleter(index)}
            >
              <a>delete</a>
            </div>
            <div
              className="Base-item-close"
              onClick={comp.getEventEnabler(index)}
            >
              <a>{item.disable ? 'hide' : 'show'}</a>
            </div>
          </div>,
        );
      });
    }
    if (this.props.chosenLabel !== this.props.label) {
      return (
        <div>
          {nodes}
          <div
            className="Base-button"
            onClick={() => this.props.labelChanger(this.props.label)}
          >
            <a>{strings.addEntry}</a>
          </div>
          <br />
        </div>
      );
    }
    const formNodes = [];
    if (this.props.fields !== undefined) {
      this.props.fields.forEach((field_info, index) => {
        formNodes.push(
          <CvField
            stateChanger={this.handleChange}
            toAdd={this.state.toAdd}
            addField={this.addField}
            id={field_info[0]}
            label={field_info[2]}
            placeholder={field_info[1]}
            mandatory
          />,
        );
      });
    }
    if (this.props.optFields !== undefined) {
      this.props.optFields.forEach((field_info, index) => {
        formNodes.push(
          <CvField
            stateChanger={this.handleChange}
            toAdd={this.state.toAdd}
            addField={this.addField}
            id={field_info[0]}
            label={field_info[2]}
            placeholder={field_info[1]}
            mandatory={false}
          />,
        );
      });
    }
    return (
      <div>
        {nodes}
        <div className="Base-form">
          {formNodes}
          <div className="Base-button" onClick={this.addField}>
            <a>{strings.addEntry}</a>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

class Builder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curriculum: this.props.cv,
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

  handleChangeHeader(event) {
    const aux = this.props.cv;
    aux.CvHeaderItem[event.target.name] = event.target.value;
    if (aux.CvHeaderItem[event.target.name] === '') {
      delete aux.CvHeaderItem[event.target.name];
    }
    this.setCv(aux);
  }
  
  downloadCvAsJson() {
    const db = firebase
      .database()
      .ref('cv-dumps-json')
      .child(
        `EMAIL:${
          this.props.user !== null
            ? this.props.user.uid
            : this.props.cv.CvHeaderItem.email !== undefined
              ? this.props.cv.CvHeaderItem.email.replace(/\./g, '_dot_')
              : ''}`,
      )
      .push();
    db.set(this.props.cv);
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
      toast.error('Invalid E-mail field');
      return;
    }
    if (this.props.cv.CvHeaderItem.name === '') {
      toast.error('Empty name field');
      return;
    }

    if (!this.props.cv.CvHeaderItem.birthday == '') {
      if (!validateDate(this.props.cv.CvHeaderItem.birthday)) {
        toast.error('Wrong birthday date format');
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
            : this.props.cv.CvHeaderItem.email !== undefined
              ? this.props.cv.CvHeaderItem.email.replace(/\./g, '_dot_')
              : ''}`,
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
          ).then((response) => {
            if (response.ok) {
              const file = response.blob();
              file.then((file) => {
                const element = document.createElement('a');
                element.href = URL.createObjectURL(file);
                element.download = 'cv.pdf';
                element.click();
              });
            } else {
              toast.error('Error processing file');
            }
          });
        });
      } else {
        const textPromise = response.text();
        textPromise.then(text => toast.error(`Error:${text}`));
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

  setCv(cv) {
    this.props.cvSetter(cv);
  }

  setLabel(label) {
    this.setState({ chosenLabel: label });
  }

  startFilePicker(e) {
    this.refs.fileUploader.click();
  }

  uploadJSON(selectorFiles) {
    const fr = new FileReader();
    fr.onload = function (e) {
      const json = fr.result;
      this.setCv(JSON.parse(json));
    }.bind(this);
    fr.readAsText(selectorFiles[0]);
  }

  render() {
    const cv_model_options = [];
    for (const cv_model_name in this.props.cv_models) {
      const cv_model = this.props.cv_models[cv_model_name];
      cv_model_options.push(
        <option key={cv_model.name} value={cv_model.name}>
          {capitalize(cv_model.name)}
        </option>,
      );
    }
    let cv_model_suboptions = [];
    if (this.props.cv_models[this.state.user_cv_model] !== undefined) {
      for (const cv_suboption of this.props.cv_models[this.state.user_cv_model].params) {
        const cv_model_suboptions_items = [];
        for (const opt in cv_suboption.mapped_options) {
          cv_model_suboptions_items.push(
            <option key={opt} value={cv_suboption.mapped_options[opt]}>
              {capitalize(opt)}
            </option>,
          );
        }
        cv_model_suboptions = cv_model_suboptions.concat([
          <br />,
          <br />,
          <div className="Base-label">
            {cv_suboption.pretty_name}
:
          </div>,
          <select
            value={this.state.params[cv_suboption.name]}
            className="Base-select"
            onChange={(e) => {
              const { params } = this.state;
              params[cv_suboption.name] = e.target.value;
              this.setState({ params });
            }}
          >
            {cv_model_suboptions_items}
          </select>,
        ]);
      }
    }
    return (
      <div className="Base">
        <div className="Base-title">Curriculum Vitae:</div>
        <br />
        <div className="Base-subtitle">{strings.header}:</div>
        <br />
        {/* PLZ REFACTOR ME */}
        <CvHeaderField
          stateChanger={this.handleChangeHeader}
          curriculum={this.props.cv}
          label={strings.name}
          id="name"
          mandatory
          placeholder={strings.namePlaceholder}
        />
        <CvHeaderField
          stateChanger={this.handleChangeHeader}
          curriculum={this.props.cv}
          label={strings.email}
          id="email"
          mandatory
          placeholder={strings.emailPlaceholder}
        />
        <CvHeaderField
          stateChanger={this.handleChangeHeader}
          curriculum={this.props.cv}
          label={strings.phone}
          id="phone"
          mandatory={false}
          placeholder={strings.phonePlaceholder + " (e.g. +55 12 3456-7890)"}
        />
        <CvHeaderField
          stateChanger={this.handleChangeHeader}
          curriculum={this.props.cv}
          label="linkedin"
          id="linkedin"
          mandatory={false}
          placeholder="Linkedin url (e.g. linkedin.com/in/youruser/)"
        />
        <CvHeaderField
          stateChanger={this.handleChangeHeader}
          curriculum={this.props.cv}
          label="github"
          id="github"
          mandatory={false}
          placeholder="GitHub url (e.g. github.com/youruser/)"
        />
        <CvHeaderField
          stateChanger={this.handleChangeHeader}
          curriculum={this.props.cv}
          label={strings.homepage}
          id="homepage"
          mandatory={false}
          placeholder={strings.homepagePlaceholder}
        />
        <CvHeaderField
          stateChanger={this.handleChangeHeader}
          curriculum={this.props.cv}
          label={strings.address}
          id="address"
          mandatory={false}
          placeholder={strings.addressPlaceholder}
        />
        <CvHeaderField
          stateChanger={this.handleChangeHeader}
          curriculum={this.props.cv}
          label={strings.birthday}
          id="birthday"
          mandatory={false}
          placeholder={strings.birthdayPlaceholder}
        />
        <CvItemForm
          chosenLabel={this.state.chosenLabel}
          label={strings.work}
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
          label={strings.education}
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
            fieldsDef.courseDescription,
            fieldsDef.teacher,
          ]}
        />
        <CvItemForm
          chosenLabel={this.state.chosenLabel}
          label={strings.academic}
          cvkey="CvAcademicProjectItem"
          curriculum={this.props.cv}
          stateChanger={this.setCv}
          labelChanger={this.setLabel}
          fields={[fieldsDef.projectName, fieldsDef.startDate]}
          optFields={[
            fieldsDef.endDate,
            fieldsDef.projectDescription,
            fieldsDef.institution,
            fieldsDef.country,
            fieldsDef.state,
            fieldsDef.city,
            fieldsDef.articleLink,
          ]}
        />
        <CvItemForm
          chosenLabel={this.state.chosenLabel}
          label={strings.achievements}
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
            fieldsDef.achievementDescription,
            fieldsDef.institution,
            fieldsDef.country,
            fieldsDef.state,
            fieldsDef.city,
            fieldsDef.place,
            fieldsDef.certificateLink,
          ]}
        />
        <CvItemForm
          chosenLabel={this.state.chosenLabel}
          label={strings.projects}
          cvkey="CvImplementationProjectItem"
          curriculum={this.props.cv}
          stateChanger={this.setCv}
          labelChanger={this.setLabel}
          fields={[fieldsDef.projectName, fieldsDef.startDate]}
          optFields={[
            fieldsDef.endDate,
            fieldsDef.projectDescription,
            fieldsDef.programLanguage,
            fieldsDef.country,
            fieldsDef.state,
            fieldsDef.city,
            fieldsDef.repositoryLink,
          ]}
        />
        <CvItemForm
          chosenLabel={this.state.chosenLabel}
          label={strings.languages}
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
          label={strings.skills}
          cvkey="CvSkillItem"
          curriculum={this.props.cv}
          stateChanger={this.setCv}
          labelChanger={this.setLabel}
          fields={[
            fieldsDef.skillName,
            fieldsDef.skillType,
          ]}
        />
        {/* YEAH ME ^^^^ */}
        <div className="Base-linemarker" />
        <div className="Base-subtitle">{strings.reorderCVAreas}:</div>
        <br />
        <CvOrder
          setOrder={({ oldIndex, newIndex }) => this.setState({
            cv_order: arrayMove(this.state.cv_order, oldIndex, newIndex),
          })
          }
          cvOrder={this.state.cv_order}
        />
        <br />
        <div className="Base-label">{strings.model}:</div>
        <select
          value={this.state.user_cv_model}
          className="Base-select"
          onChange={(e) => {
            this.setState({
              user_cv_model: e.target.value,
              params: this.props.cv_models[e.target.value].fixed_params,
            });
          }}
        >
          {cv_model_options}
        </select>
        {cv_model_suboptions}
        <br />
        <br />
        <div className="Base-button">
          <a onClick={this.startFilePicker}>
            <input
              type="file"
              id="file"
              ref="fileUploader"
              onChange={e => this.uploadJSON(e.target.files)}
              style={{ display: 'none' }}
            />
            {strings.uploadJson}
          </a>
        </div>
        <div className="Base-button">
          <a onClick={this.downloadCvAsJson}>{strings.downloadJson}</a>
        </div>
        <div className="Base-button">
          <a onClick={this.downloadCvAsPDF}>{strings.downloadCV}</a>
        </div>
        {this.props.user !== null ? (
          <div className="Base-button">
            <a onClick={this.saveOnAccount}>{strings.saveCVOnAccount}</a>
          </div>
        ) : null}
        <br />
      </div>
    );
  }
}

export default Builder;
