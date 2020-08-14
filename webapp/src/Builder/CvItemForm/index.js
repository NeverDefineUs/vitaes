import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Button, Card } from 'react-bootstrap';
import arrayMove from 'array-move';
import _ from 'lodash';

import { translate } from 'i18n/locale';
import validateDate from 'utils/validateDate';

import { fieldsDef, updateFields } from '../shared/fields';
import CvField from './CvField';
import { CvItemOrder } from './CvItemOrder';

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
    this.getEventEnabler = this.getEventEnabler.bind(this);
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
      if (this.props.chosenLabel !== '') {
        toast.error(translate('error_close_item_edit'));
        return;
      }
      const cv = this.props.curriculum;
      const toAdd = cv[this.props.cvkey][index];
      cv[this.props.cvkey].splice(index, 1);
      this.props.stateChanger(cv);
      if (toAdd.institution !== undefined) {
        toAdd.institution = toAdd.institution.name;
      }
      if (toAdd.location !== undefined) {
        for (const locField of locFields) {
          if (toAdd.location[locField[0]] !== undefined) {
            toAdd[locField[0]] = toAdd.location[locField[0]];
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
        toast.error(`${translate('mandatory_field')}: ${item[2]}`);
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
      const institution = { name: toAdd.institution };
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
      toAdd.location = cvLocation;
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
      <hr key={-3}/>,
      <h3 key={-2}>
        {this.props.label}
        :
      </h3>,
      <br key={-1} />,
    ];
    const comp = this;
    if (this.props.curriculum[this.props.cvkey] !== undefined) {
      nodes.push(<CvItemOrder
        key={this.props.cvkey}
        onSortEnd={({ oldIndex, newIndex }) => {
          const items = arrayMove(this.props.curriculum[this.props.cvkey], oldIndex, newIndex);
          const cv = _.cloneDeep(this.props.curriculum);
          cv[this.props.cvkey] = items;
          this.props.stateChanger(cv);
        }}
        items={this.props.curriculum[this.props.cvkey]}
        getEventDeleter={comp.getEventDeleter}
        getEventEnabler={comp.getEventEnabler}
        getEventExpander={comp.getEventExpander}
      />);
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
            <Button
              variant="secondary"
              style={{ float: 'right', marginLeft: 5 }}
              onClick={this.addField}
            >
              {translate('add_entry')}
            </Button>
            <Button
              variant="secondary"
              style={{ float: 'right', marginLeft: 5 }}
              onClick={() => {
                this.setState({ toAdd: {} });
                this.props.labelChanger('');
              }}
            >
              {translate('cancel')}
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default CvItemForm;
