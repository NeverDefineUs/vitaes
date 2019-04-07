import React, { useState } from 'react';
import { Card, Grid } from 'semantic-ui-react';

import capitalize from 'utils/capitalize';

import './TemplateHubModel.css';
import { TemplateModelPopup } from './TemplateModelPopup';
import { likeTemplate } from './util';

export const TemplateHubModel = (props) => {
  const [show, setShow] = useState(false);

  const { model } = props;
  const parameters = [];
  for (const val of model.params) {
    parameters.push(<div>{capitalize(val.pretty_name)}</div>);
    const paramOptions = [];
    for (const opt in val.mapped_options) {
      paramOptions.push(<li>{opt}</li>);
    }
    parameters.push(<ul>{paramOptions}</ul>);
  }
  return (
    <Grid.Column>
      <Grid centered style={{ marginTop: 30 }}>
        <Card>
          <TemplateModelPopup
            show={show}
            onHide={() => setShow(false)}
            image={model.data.image}
            title={capitalize(props.keyName)}
          />
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <img
            style={{ objectFit: 'scale-down', height: '30em' }}
            alt="Template preview"
            src={model.data.image}
            onClick={() => setShow(true)}
          />
          <Card.Content style={{ background: '#f5f5f5' }}>
            <Card.Header>{capitalize(props.keyName)}</Card.Header>

            <div
              className="template-button"
              role="button"
              onClick={() => likeTemplate(props.user, props.keyName, props.fetchTemplates())
            }
            >
              <a>
                <img alt="" src="/Ei-heart.svg" />
                <span>{model.data.likes}</span>
              </a>
            </div>
          </Card.Content>
        </Card>
      </Grid>
    </Grid.Column>
  );
};

export default TemplateHubModel;
