import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Alert, Button, Card } from 'react-bootstrap';

import { translate } from 'i18n/locale';
import capitalize from 'utils/capitalize';
import validateDate from 'utils/validateDate';

import { fieldsDef, updateFields } from '../shared/fields';
import CvField from './CvField';

updateFields();

const locFields = [
  fieldsDef.country,
  fieldsDef.state,
  fieldsDef.city,
];

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
          if (toAdd.location.CvLocation[locField[0]] !== undefined) {
            toAdd[locField[0]] = toAdd.location.CvLocation[locField[0]];
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
          toast.error(`${translate('mandatory_field')}: ${translate('title')}`);
        } else {
          toast.error(`${translate('mandatory_field')}: ${capitalize(item[0])}`);
        }
        return false;
      }
    }
    for (const item in toAdd) {
      if (item.endsWith('date') && toAdd[item]) {
        if (!validateDate(toAdd[item])) {
          toast.error(`${translate('wrong_format')}: ${item}`);
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
      for (const locField of locFields) {
        if (toAdd[locField[0]] !== undefined) {
          cvLocation[locField[0]] = toAdd[locField[0]];
        }
      }
      toAdd.location = { CvLocation: cvLocation };
      for (const locField of locFields) {
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
      <hr />,
      <h3 key={-2}>
        {this.props.label}
        :
      </h3>,
      <br key={-1} />,
    ];
    const comp = this;
    if (this.props.curriculum[this.props.cvkey] !== undefined) {
      this.props.curriculum[this.props.cvkey].forEach((item, index) => {
        let name = '';
        if (item.name !== undefined) {
          ({ name } = item);
        } else if (item.institution !== undefined) {
          ({ name } = item.institution.CvInstitution);
        } else if (item.language !== undefined) {
          name = item.language;
        } else {
          name = `${item.skill_type}: ${item.skill_name}`;
        }
        nodes.push(
          <Alert
            variant="secondary"
            style={{
              width: '100%', paddingBottom: 6, paddingRight: 5, paddingTop: 2, marginBottom: 5, marginTop: 5,
            }}
            key={name}
          >
            {name}
            <Button
              variant="dark"
              size="sm"
              onClick={comp.getEventDeleter(index)}
              style={{ marginLeft: 5, float: 'right' }}
            >
              {translate('delete')}
            </Button>
            <Button
              variant="dark"
              size="sm"
              onClick={comp.getEventEnabler(index)}
              style={{ marginLeft: 5, float: 'right' }}
            >
              {translate(item.disable ? 'hide' : 'show')}
            </Button>
            <Button
              variant="dark"
              size="sm"
              onClick={comp.getEventExpander(index)}
              style={{ marginLeft: 5, float: 'right' }}
            >
              {translate('edit')}
            </Button>
          </Alert>,
        );
      });
    }
    if (this.props.chosenLabel !== this.props.label) {
      return (
        <div>
          {nodes}
          <Button
            variant="secondary"
            style={{ float: 'right' }}
            onClick={() => this.props.labelChanger(this.props.label)}
          >
            {translate('add_entry')}
          </Button>
          <br />
        </div>
      );
    }
    const formNodes = [];
    if (this.props.fields !== undefined) {
      this.props.fields.forEach((fieldInfo) => {
        formNodes.push(
          <CvField
            stateChanger={this.handleChange}
            toAdd={this.state.toAdd}
            addField={this.addField}
            id={fieldInfo[0]}
            label={fieldInfo[2]}
            placeholder={fieldInfo[1]}
            mandatory
          />,
        );
      });
    }
    if (this.props.optFields !== undefined) {
      this.props.optFields.forEach((fieldInfo) => {
        formNodes.push(
          <CvField
            stateChanger={this.handleChange}
            toAdd={this.state.toAdd}
            addField={this.addField}
            id={fieldInfo[0]}
            label={fieldInfo[2]}
            placeholder={fieldInfo[1]}
            mandatory={false}
          />,
        );
      });
    }
    return (
      <div>
        {nodes}
        <Card style={{ padding: 10 }}>
          <Card.Body>
            {formNodes}
          </Card.Body>
          <Button
            variant="secondary"
            style={{ float: 'right' }}
            onClick={this.addField}
          >
            {translate('add_entry')}
          </Button>
        </Card>
      </div>
    );
  }
}

export default CvItemForm;
