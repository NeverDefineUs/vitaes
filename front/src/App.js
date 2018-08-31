import React, { Component } from 'react';
import './App.css';
import Builder from './Builder';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {tab: 1}
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to CVCS</h1>
        </header>
        <div className="App-sidenav">
          <a onClick={() => { this.setState({tab: 1}) }}>Test Me</a>
          <a href="https://github.com/Arthurlpgc/CVCS" onClick={() => { this.setState({tab: 3}) }}>About The Project</a>
        </div>
        <div className="App-intro">
          { this.state.tab === 1 ? <Builder> </Builder> : null }
        </div>
      </div>
    );
  }
}

export default App;
