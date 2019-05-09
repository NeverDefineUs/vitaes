import React, { Component } from 'react';
import { Segment, Button, Icon } from 'semantic-ui-react';

import { translate } from 'i18n/locale';

const imagesSrcs = {
  Arthurlpgc: 'https://avatars1.githubusercontent.com/u/11645779?s=400&v=4',
  RamonSaboya: 'https://avatars0.githubusercontent.com/u/5997047?s=400&v=4',
  Magsouza: 'https://avatars1.githubusercontent.com/u/37961381?s=400&v=4',
};

class About extends Component {
  render() {
    return (
      <Segment secondary style={{ paddingBottom: 30, marginBottom: 10 }}>
        <h1>
          {translate('about_the_project')}
          :
        </h1>
        <br />
        <h2>
          {translate('major_contributors')}
          :
        </h2>
        <h3> Arthurlpgc</h3>
        <img src={imagesSrcs.Arthurlpgc} alt="" className="Base-profile" />
        <br />
        {translate('contact_email')}
        : latache@vitaes.io
        <br />
        <br />
        <h3> RamonSaboya</h3>
        <img src={imagesSrcs.RamonSaboya} alt="" className="Base-profile" />
        <br />
        {translate('contact_email')}
        : saboya@vitaes.io
        <br />
        <br />
        <h3> Magsouza</h3>
        <img src={imagesSrcs.Magsouza} alt="" className="Base-profile" />
        <br />
        {translate('contact_email')}
        : mag@vitaes.io
        <br />
        <br />
        <h2>
          {translate('other_contributors')}
          :
        </h2>
        <ul>
          <li>
            <strong>acrc2:</strong>
            {' '}
            Made the birthday validation.
          </li>
          <li>
            <strong>Hildemir:</strong>
            {' '}
            Refactors on the validation functions.
          </li>
          <li>
            <strong>jvsn19:</strong>
            {' '}
            Helped modeling the base classes.
          </li>
          <li>
            <strong>rfrl:</strong>
            {' '}
            Helped testing and deploying.
          </li>
          <li>
            <strong>vjsl:</strong>
            {' '}
            Helped uncover a bug with accents and on
                        adding https.
          </li>
        </ul>
        <br />
        <h2>
          {translate('template_contributors')}
          :
        </h2>
        <ul>
          <li>
            <strong>posquit0:</strong>
            {' '}
            Awesome CV.
          </li>
          <li>
            <strong>Xavier Danaux:</strong>
            {' '}
            Modern CV(not the git user).
          </li>
        </ul>
        <h2>
          {translate('repository')}
          :
        </h2>
        <Button 
          secondary
          small
          icon
          href="https://github.com/NeverDefineUs/vitaes">
          <Icon name='github' />
          {' ' + translate('view_on_github')}
        </Button>
        <br />
        <br />
      </Segment>
    );
  }
}

export default About;
