import React, {Component} from 'react';
import './App.css';
import GameViewer from './GameViewer';
import CustomDropdown from './customDropdown';

class App extends Component {
  render() {
    const choices = ['releaseDate', 'review_count', 'full_price'];
    return (
      <main>
        <CustomDropdown choices={choices} />
        <GameViewer />
      </main>
    );
  }
}

export default App;
