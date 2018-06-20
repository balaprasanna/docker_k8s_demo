import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  getExplorer = (serchwords) => {
    const apiUrl = `http://localhost:9000/api`;

    fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        alert(JSON.stringify(response));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          <button onClick={this.getExplorer}>Get API Message!</button>
        </p>
      </div>
    );
  }
}
export default App;
