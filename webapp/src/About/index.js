import React, { Component } from 'react';
import { Segment, Button, Card, Icon, Image, Loader } from 'semantic-ui-react';
import gh from './github_service';

import { translate } from 'i18n/locale';
import ReactPixel from 'react-facebook-pixel';

const imagesSrcs = {
  Arthurlpgc: 'https://avatars1.githubusercontent.com/u/11645779?s=400&v=4',
  RamonSaboya: 'https://avatars0.githubusercontent.com/u/5997047?s=400&v=4',
  Magsouza: 'https://avatars1.githubusercontent.com/u/37961381?s=400&v=4',
};

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collaborators: [],
      stats: [], 
      loaded: false
    };
  }

  loadGithub = async () => {
    const collaborators = await gh.getCollaborators();
    const stats = await gh.getContributorStats();
    console.log(collaborators);
    this.setState({collaborators : collaborators});
    stats.forEach(element => {
        let add = 0;
        let dell = 0;
        element.weeks.forEach(week => {
          add += week.a;
          dell += week.d;
        })
        element.additions = add;
        element.deletions = dell;

        element.login = element.author.login
          
    });
    console.log(stats);
    this.setState({stats : stats});
    this.setState({loaded : true});
  }


  componentDidMount() {
    this.loadGithub();
    ReactPixel.init('898969540474999');
    ReactPixel.pageView(); 
    
  }

  render() {
    return (
      <div>
        {this.state.loaded?<Segment secondary style={{ paddingBottom: 30, marginBottom: 10 }}>
        <h1>
          {translate('about_the_project')}
          :
        </h1>
        <br />
        <h2>
          {translate('major_contributors')}
          :
        </h2>
        <Card.Group centered>
          <Card style={{ margin : 20 }}>
            <Image src={imagesSrcs.Arthurlpgc} wrapped ui={false} />
            <Card.Content>
              <Card.Header href="https://github.com/Arthurlpgc">Arthurlpgc</Card.Header>
              <Card.Meta>
                <span className='date'>latache@vitaes.io</span>
              </Card.Meta>
              <Card.Description>
                
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <span>{this.state.stats.find(el => el.login == "Arthurlpgc").total} commits </span>
                <span style={{color : 'green'}}>{this.state.stats.find(el => el.login == "Arthurlpgc").additions}++ </span> 
                <span style={{color : 'red'}}>{this.state.stats.find(el => el.login == "Arthurlpgc").deletions}-- </span> 
             </Card.Content>
          </Card>

          <Card style={{ margin : 20 }}>
            <Image src={imagesSrcs.RamonSaboya} wrapped ui={false} />
            <Card.Content>
              <Card.Header href="https://github.com/RamonSaboya">RamonSaboya</Card.Header>
              <Card.Meta>
                <span className='date'>saboya@vitaes.io</span>
              </Card.Meta>
              <Card.Description>
                
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
          
                <span>{this.state.stats.find(el => el.login == "ramonsaboya").total} commits </span>
                <span style={{color : 'green'}}>{this.state.stats.find(el => el.login == "ramonsaboya").additions}++ </span> 
                <span style={{color : 'red'}}>{this.state.stats.find(el => el.login == "ramonsaboya").deletions}-- </span> 
              
             </Card.Content>
          </Card>

          <Card style={{ margin : 20 }}>
            <Image src={imagesSrcs.Magsouza} wrapped ui={false} />
            <Card.Content>
              <Card.Header href="https://github.com/Magsouza">Magsouza</Card.Header>
              <Card.Meta>
                <span className='date'>mag@vitaes.io</span>
              </Card.Meta>
              <Card.Description>
                
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              
                <span>{this.state.stats.find(el => el.login == "magsouza").total} commits </span>
                <span style={{color : 'green'}}>{this.state.stats.find(el => el.login == "magsouza").additions}++ </span> 
                <span style={{color : 'red'}}>{this.state.stats.find(el => el.login == "magsouza").deletions}-- </span>
             
             </Card.Content>
          </Card>


        </Card.Group>


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
          href="https://github.com/NeverDefineUs/vitaes"
        >
          <Icon name="github" />
          {` ${translate('view_on_github')}`}
        </Button>
        <br />
        <br />
      </Segment>
      :<Segment><Loader active /></Segment>}
      </div>
      );
  }
}

export default About;
