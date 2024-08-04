import './App.css';
import { GameContext, GameContextProps } from './GameContext';
import React, { Component } from 'react';
import { HexGrid } from 'react-hexgrid';
import GameBoard from './GameBoard';
import PlayArea from './PlayArea';

import SetupArea from './SetupArea';

import { GameProvider } from './GameContext';

class App extends Component {
  static contextType = GameContext;
  context!: React.ContextType<typeof GameContext>;

  render() {
    const { state } = this.context as GameContextProps;
    return (
      <GameProvider>
        <SetupArea />
        <div className="game-board" style={{ backgroundImage: `url(${state.selectedBoard})` }}>
          <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
            <GameBoard />
          </HexGrid>
        </div>
        <div className="play-area">
          <HexGrid width={1200} height={120} >
            <PlayArea />
          </HexGrid>
        </div>
      </GameProvider>
    );
  }
}

export default App;
