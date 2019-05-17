import React, { Component } from 'react';
import arrayMove from 'array-move';
import _ from 'lodash';
import {
  Button, Form, Col, Row,
} from 'react-bootstrap';

import BugReporter from 'BugReporter';
import { translate, getActiveLocale } from 'i18n/locale';
import capitalize from 'utils/capitalize';

import { Segment } from 'semantic-ui-react';
import CvOrder from './CvOrder';
import CvHeaderField from './CvHeaderField';
import CvItemForm from './CvItemForm';
import headerFields from './headerFields';
import { cvFormFields, updateFormFields } from './cvFormFields';
import CvActionMenu from './CvActionMenu';

class Builder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBugUi: false,
      chosenLabel: '',
    };
    this.handleChangeHeader = this.handleChangeHeader.bind(this);
    this.setCv = this.setCv.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.setLabel = this.setLabel.bind(this);
  }

  setCv(cv) {
    const { userData } = this.props;
    userData.cv = cv;
    this.props.userDataSetter(userData);
  }

  setLabel(label) {
    this.setState({ chosenLabel: label });
  }

  updateUserData(data) {
    const { userData } = this.props;
    this.props.userDataSetter(_.assign(userData, data));
  }

  handleChangeHeader(event) {
    const aux = this.props.userData.cv;
    aux.CvHeaderItem[event.target.name] = event.target.value;
    if (aux.CvHeaderItem[event.target.name] === '') {
      delete aux.CvHeaderItem[event.target.name];
    }
    this.setCv(aux);
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
      && this.props.cv_models[this.props.userData.user_cv_model] !== undefined) {
      for (const cvSuboption of this.props.cv_models[this.props.userData.user_cv_model].params) {
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
                value={this.props.userData.user_cv_model[cvSuboption.name]}
                onChange={(e) => {
                  const { params } = this.props.userData;
                  params[cvSuboption.name] = e.target.value;
                  this.updateUserData({ params });
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
      <Segment secondary style={{ paddingBottom: 30, marginBottom: 10 }}>
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
              curriculum={this.props.userData.cv}
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
            curriculum={this.props.userData.cv}
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
          setOrder={({ oldIndex, newIndex }) => this.updateUserData({
            cv_order: arrayMove(this.props.userData.cv_order, oldIndex, newIndex),
          })
          }
          cvOrder={this.props.userData.cv_order}
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
              value={this.props.userData.user_cv_model}
              onChange={(e) => {
                this.updateUserData({
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
        <CvActionMenu
          setShowBugUi={value => this.setState({ showBugUi: value })}
          setCv={this.setCv}
          user={this.props.user}
          userData={this.props.userData}
        />
        <BugReporter
          show={this.state.showBugUi}
          data={{
            userData: this.props.userData,
            lang: getActiveLocale(),
          }}
          onHide={() => this.setState({ showBugUi: false })}
        />
      </Segment>
    );
  }
}

export default Builder;
