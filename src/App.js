import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Footer from './ui/Footer.js';
import Content from './ui/Content.js';
import Header from './ui/Header.js';

class App extends Component {

  render() {
    return (
      <>
        <div className="App_Header">
          <Header />
        </div>
          <div className="App_Content">
            <Content/>
          </div>
        <div className="App_Footer">
          <Footer />
        </div>
      </>
    );
  }
}

export default App;
