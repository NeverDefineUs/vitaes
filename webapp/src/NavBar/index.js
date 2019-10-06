import React from 'react';
import firebase from 'firebase';
import { getActiveLanguage } from 'i18n/locale';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';

import { translate } from 'i18n/locale';

import Login from 'Login';

const NavbarStyle = {margin: 0, padding: 0, border:0, borderRadius:0, width: "100%", flex: '0 1 3em', background:'#343a40'};

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      permissions: null,
      showLogin: false,
    };

    this.showLogin = this.showLogin.bind(this);
    this.hideLogin = this.hideLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    firebase
      .database()
      .ref('permissions')
      .on('value', (snapshot) => {
        this.setState({ permissions: snapshot.val() });
      });

    firebase
      .auth()
      .getRedirectResult()
      .then(() => {
        const user = firebase.auth().currentUser;
        this.setState({ user });
      });
  }

  logout() {
    firebase.auth().signOut();
    this.setState({ user: null });
  }

  showLogin() {
    this.setState({ showLogin: true });
  }

  hideLogin() {
    this.setState({ showLogin: false });
  }

  render() {
    const { onChangeLanguage } = this.props;
    const { user, showLogin } = this.state;

    return (
      <React.Fragment>
        <div style={{height: '100%', display: 'flex', maxHeight: '100%', flexDirection: 'column'}}>
          <Menu
            inverted
            style={NavbarStyle}
            secondary
          >
            <Menu.Item
              name='editorials'
            >
              Vitaes
            </Menu.Item>
            <Menu.Menu position='right'>
              <Dropdown item text={getActiveLanguage().toUpperCase()}>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => onChangeLanguage('en_US')} text="English" />
                  <Dropdown.Item onClick={() => onChangeLanguage('pt_BR')} text="Português" />
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown item icon='bars'>
                <Dropdown.Menu>
                  <Dropdown.Item as='a' href='/' text={translate('create_cv')} />
                  <Dropdown.Item as='a' href='/about' text={translate('about_the_project')} />
                  <Dropdown.Item as='a' href='/privacy' text={translate('privacy_policy')} />
                  { user !== null ? 
                    <Dropdown.Item onClick={this.logout}>{translate('sign_out')}</Dropdown.Item>
                  : 
                    <Dropdown.Item onClick={this.showLogin}>{translate('sign_in')}</Dropdown.Item>
                  }
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Menu>
          <Segment basic style={{overflow: "auto", flex: "1 1 auto", padding: 0, margin: 0}}>
            {this.props.children}
          </Segment>
        </div>
        <Login
          show={showLogin}
          onHide={this.hideLogin}
          skipLogin={() => {
            this.hideLogin();
          }}
        />
      </React.Fragment>
    );
  }
}

export default NavBar;
