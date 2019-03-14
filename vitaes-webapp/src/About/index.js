import React, { Component } from 'react';
import { strings } from './../i18n/strings';

const imagesSrcs = {
  Arthurlpgc: 'https://avatars1.githubusercontent.com/u/11645779?s=400&v=4',
  RamonSaboya: 'https://avatars0.githubusercontent.com/u/5997047?s=400&v=4',
  Magsouza: 'https://avatars1.githubusercontent.com/u/37961381?s=400&v=4',
};

class About extends Component {
  render() {
    return (
      <div className="Base">
        <h1>
          {strings.aboutTheProject}
          :
        </h1>
        <br />
        <h2>
          {strings.majorContributors}
          :
        </h2>
        <h3> Arthurlpgc</h3>
        <img src={imagesSrcs.Arthurlpgc} alt="" className="Base-profile" />
        <br />
        {strings.contactEmail}
        : latache@vitaes.io
        <br />
        <br />
        <h3> RamonSaboya</h3>
        <img src={imagesSrcs.RamonSaboya} alt="" className="Base-profile" />
        <br />
        {strings.contactEmail}
        : saboya@vitaes.io
        <br />
        <br />
        <h3> Magsouza</h3>
        <img src={imagesSrcs.Magsouza} alt="" className="Base-profile" />
        <br />
        {strings.contactEmail}
        : mag@vitaes.io
        <br />
        <br />
        <h2>
          {strings.otherContributors}
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
          {strings.templateContributors}
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
          {strings.repository}
          :
        </h2>
        https://github.com/NeverDefineUs/vitaes
        <br />
        <br />
      </div>
    );
  }
}

export default About;
