import React from 'react';
import firebase from 'firebase';
import { Dropdown, Icon, Menu, Segment, Grid, } from 'semantic-ui-react';

import { translate } from 'i18n/locale';

import Login from 'Login';

const SidebarStyle = {margin: 0, padding: 0, border:0, borderRadius:0, height: "100%", background:'#343a40'};
const gridStyle = {padding: 0, margin: 0, height:'100%'};

class SideNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      permissions: null,
      showLogin: false,
      showLanguage: false,
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
    const { user, permissions, showLogin } = this.state;
    const onChangeLanguage = (a) => {this.props.onChangeLanguage(a); this.setState({showLanguage: false})};
    
    return (
      <React.Fragment>
          <Grid style={gridStyle} stretched>
            <Grid.Column width={2} style={gridStyle}>
              <Menu
                secondary
                style={SidebarStyle}
                animation='push'
                icon='labeled'
                inverted
                vertical
                visible
                width='thin'
              >
                <Menu.Item as='a' href='/'>
                  <Icon name='tasks' />
                  {translate('create_cv')}
                </Menu.Item>
                <Menu.Item as='a' href='/privacy'>
                  <Icon name='book' />
                  {translate('privacy_policy')}
                </Menu.Item>
                <Menu.Item as='a' href='/about'>
                  <Icon name='info' />
                  {translate('about_the_project')}
                </Menu.Item>
                <Menu.Item as='a' onClick={() => this.setState({showLanguage: !this.state.showLanguage})}>
                  <Icon name='world' />
                  {translate('language')}
                </Menu.Item>
                {(this.state.showLanguage ?
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => onChangeLanguage('en_US')}>English</Dropdown.Item>
                    <Dropdown.Item onClick={() => onChangeLanguage('pt_BR')}>Português</Dropdown.Item>
                  </Dropdown.Menu> : null)
                }
                {user !== null ? (
                  <Menu.Item onClick={this.logout}>
                    <Icon name='user times' />
                    {translate('sign_out')}
                  </Menu.Item>
                ) : (
                  <Menu.Item onClick={this.showLogin}>
                    <Icon name='user' />
                    {translate('sign_in')}
                  </Menu.Item>
                )}
                {user !== null && permissions !== null && permissions[user.uid]
                ? (
                    <Menu.Menu>
                      <Menu.Item
                        as="a"
                        href="/alert-manager"
                      >
                        {translate('alert_manager')}
                      </Menu.Item>
                      <Menu.Item
                        as="a"
                        href="https://grafana.vitaes.io/"
                      >
                        Grafana
                      </Menu.Item>
                      <Menu.Item
                        as="a"
                        href="https://sqlite.vitaes.io/"
                      >
                        SQLite
                      </Menu.Item>
                      <Menu.Item
                        as="a"
                        href="https://github.com/NeverDefineUs/vitaes"
                      >
                        GitHub
                      </Menu.Item>
                    </Menu.Menu>
                  )
                  : null
                }
              </Menu>
            </Grid.Column>
            <Grid.Column width={14} style={{padding: 0, overflow: "auto", height:"100%"}}>
              <Segment basic style={{overflow: "auto", height:"100%"}}>
                {this.props.children}
              </Segment>
            </Grid.Column>
            </Grid>
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

export default SideNavBar;
