import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { translate } from 'i18n/locale';

function DevMenu(props) {
  const { hasPermissions } = props;

  if (hasPermissions) {
    return (
      <Dropdown alignRight className="mr-5 mt-2">
        <Dropdown.Toggle>dev</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="/create-template">{ translate('dev_options') }</Dropdown.Item>
          <Dropdown.Item href="/alert-manager">{ translate('create_template') }</Dropdown.Item>
          <Dropdown.Item href="https://grafana.vitaes.io">{ translate('alert_manager') }</Dropdown.Item>
          <Dropdown.Item href="https://sqlite.vitaes.io">SQlite</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  return null;
}

export default DevMenu;
