import React, {Component} from 'react';
import './App.css';
import GameViewer from './GameViewer';
import CustomDropdown from './customDropdown';

class App extends Component {
  render() {
    return (
      <main>
        <GameViewer />
      </main>
    );
  }
}

export default App;
