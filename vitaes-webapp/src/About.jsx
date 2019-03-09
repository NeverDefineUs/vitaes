import React, { Component } from 'react';
import './Builder.css';
import Arthurlpgc from './Profile/Arthurlpgc.jpg';
import RamonSaboya from './Profile/RamonSaboya.jpg';
import { strings } from './i18n/strings';

class About extends Component {
  render() {
    return (
      <div className="Base">
        <div className="Base-title">
          {strings.aboutTheProject}
:
        </div>
        <br />
        <div className="Base-subtitle">Major Contributors:</div>
        <br />
        <h3> Arthurlpgc</h3>
        <br />
        <img src={Arthurlpgc} alt="" className="Base-profile" />
        <br />
        Contact Email: latache@vitaes.io
        <br />
        <br />
        <h3> RamonSaboya</h3>
        <br />
        <img src={RamonSaboya} alt="" className="Base-profile" />
        <br />
        Contact Email: saboya@vitaes.io
        <br />
        <br />
        <h3> Magsouza</h3>
        <br />
        <img src="https://avatars1.githubusercontent.com/u/37961381?s=400&v=4" alt="" className="Base-profile" />
        <br />
        Contact Email: mag@vitaes.io
        <br />
        <br />
        <br />
        <div className="Base-subtitle">Other Contributors:</div>
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
        <br />
        <div className="Base-subtitle">
          Indirect Contributors(Made their templates open source):
        </div>
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
        <div className="Base-subtitle">Repo:</div>
        <br />
        https://github.com/NeverDefineUs/vitaes
        <br />
        <br />
      </div>
    );
  }
}

export default About;
