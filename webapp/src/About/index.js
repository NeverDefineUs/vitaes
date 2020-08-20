import React, { Component } from 'react';
import { Segment, Button, Card, Icon, Image, Loader } from 'semantic-ui-react';
import gh from './github_service';
import {Line} from 'react-chartjs-2';

import { translate } from 'i18n/locale';
import ReactPixel from 'react-facebook-pixel';

const imagesSrcs = {
  Arthurlpgc: 'https://avatars1.githubusercontent.com/u/11645779?s=400&v=4',
  RamonSaboya: 'https://avatars0.githubusercontent.com/u/5997047?s=400&v=4',
  Magsouza: 'https://avatars1.githubusercontent.com/u/37961381?s=400&v=4',
};


var commitsUrl = 'https://github.com/NeverDefineUs/vitaes/commits?author='

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collaborators: [],
      stats: [], 
      loaded: false
    };
  }

  dealStats = (stats) => {
    stats.forEach(element => {
      let add = 0;
      let dell = 0;
      element.weeks.forEach(week => {
        add += week.a;
        dell += week.d;
      })
      element.additions = add;
      element.deletions = dell;

      element.login = element.author.login;
        
    });
    
    return stats;
  }

  makeCommitsGraph = (stats) =>{
    var weeks = []

    stats[0].weeks.forEach(week =>{
      var date = new Date(week.w * 1000)
      weeks.push(date.getMonth() + '/' + date.getUTCFullYear())
    })

    var commits = []

    for(var i = 0; i < stats.length; i++){
      for(var j = 0; j < stats[i].weeks.length; j++){
        if(i === 0){
          commits.push(stats[i].weeks[j].c)
        }else{
          commits[j] += stats[i].weeks[j].c
        }
      }
    }
    
    console.log(commits)

    var d = {
      labels : weeks,
      datasets : [{
        label : 'Commits',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        spanGaps : false,
        data : commits
      }]
    }

    this.setState({commitGraph: <Line 
      data={d}
      width={100}
      height={50}
    />})
  }



  makeMinorContributors = (stats) =>{
    function isMinor(value){
      return value.login !== "Arthurlpgc" && value.login !== "ramonsaboya" && value.login !== "magsouza"
    }
    let coll = [];
    let minorStats = stats.filter(isMinor);
    minorStats.sort((a, b) => a.additions + a.deletions < b.additions + b.deletions);
    console.log(minorStats)

    minorStats.forEach(stat => {
      coll.push(
        <Card>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src={stat.author.avatar_url}
          />
          <Card.Header href={stat.author.html_url}>{stat.login}</Card.Header>
        </Card.Content>
        <Card.Content extra>
              <span> <a href={`${commitsUrl}${stat.login}`}>{stat.total} commits</a>  </span>
              <span style={{color : 'green'}}>{stat.additions}++ </span> 
              <span style={{color : 'red'}}>{stat.deletions}-- </span>            
        </Card.Content>
        </Card>
      )
    })
    this.setState({minors : coll})
  }

  loadGithub = async () => {
    const collaborators = await gh.getCollaborators();
    var stats = await gh.getContributorStats();
    this.setState({collaborators : collaborators});
    stats = this.dealStats(stats);
    this.makeMinorContributors(stats);
    this.makeCommitsGraph(stats);
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
                <span> <a href={`${commitsUrl}Arthurlpgc`}> {this.state.stats.find(el => el.login === "Arthurlpgc").total}  commits </a>  </span>
                <span style={{color : 'green'}}>{this.state.stats.find(el => el.login === "Arthurlpgc").additions}++ </span> 
                <span style={{color : 'red'}}>{this.state.stats.find(el => el.login === "Arthurlpgc").deletions}-- </span> 
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
          
                <span> <a href={`${commitsUrl}ramonsaboya`}>{this.state.stats.find(el => el.login === "ramonsaboya").total} commits </a> </span>
                <span style={{color : 'green'}}>{this.state.stats.find(el => el.login === "ramonsaboya").additions}++ </span> 
                <span style={{color : 'red'}}>{this.state.stats.find(el => el.login === "ramonsaboya").deletions}-- </span> 
              
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
              
                <span> <a href={`${commitsUrl}magsouza`}> {this.state.stats.find(el => el.login === "magsouza").total} commits </a> </span>
                <span style={{color : 'green'}}>{this.state.stats.find(el => el.login === "magsouza").additions}++ </span> 
                <span style={{color : 'red'}}>{this.state.stats.find(el => el.login === "magsouza").deletions}-- </span>
             
             </Card.Content>
          </Card>


        </Card.Group>

        <h2>
          {translate('other_contributors')}
          :
        </h2>

        <Card.Group centered>
          {this.state.minors}
        </Card.Group>

        <Card fluid>
          <Card.Content>
            {this.state.commitGraph}
          </Card.Content>
        </Card>
        
        
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
