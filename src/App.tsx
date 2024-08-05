import './App.css';
import { GameContext, GameContextProps, PlayState } from './GameContext';
import React, { Component } from 'react';
import { HexGrid } from 'react-hexgrid';
import GameBoard from './GameBoard';
import PlayArea from './PlayArea';

import SetupArea from './SetupArea';

import { GameProvider } from './GameContext';
import ScoreModal from './ScoreModal';

class App extends Component {
  static contextType = GameContext;
  context!: React.ContextType<typeof GameContext>;

  render() {
    const { state, setShowScoreModal } = this.context as GameContextProps;
    return (
      <GameProvider>
        <SetupArea />
        <GameBoard />
        <div className="play-area">
          <HexGrid width={1200} height={120} >
            <PlayArea />
          </HexGrid>
        </div>
        {<button color="green" onClick={() => setShowScoreModal(true)}>Show Score</button>}
        <ScoreModal />
      </GameProvider>
    );
  }
}

export default App;