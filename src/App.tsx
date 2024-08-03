import './App.css';
import React, { Component } from 'react';
import { HexGrid } from 'react-hexgrid';
import GameBoard from './GameBoard';
import blue from './calico tiles/boards/blue.jpg';
import green from './calico tiles/boards/green.jpg';
import purple from './calico tiles/boards/purple.jpg';
import yellow from './calico tiles/boards/yellow.jpg';
import SetupArea from './SetupArea';
import almond from './calico tiles/catGoals/almond.png';
import callie from './calico tiles/catGoals/callie.png';
import cira from './calico tiles/catGoals/cira.png';
import coconut from './calico tiles/catGoals/coconut.png';
import gwen from './calico tiles/catGoals/gwen.png';
import leo from './calico tiles/catGoals/leo.png';
import millie from './calico tiles/catGoals/millie.png';
import rumi from './calico tiles/catGoals/rumi.png';
import tecolote from './calico tiles/catGoals/tecolote.png';
import tibbit from './calico tiles/catGoals/tibbit.png';
import { getDistinctRandomNumbers } from './helperMethods';


interface AppState {
  selectedBoard: string;
  catGoals: string[];
}

class App extends Component<{}, AppState>{
  constructor(props: {}) {
    super(props);
    const boards = [ blue, green, purple, yellow ];
    const catGoals = [ almond, callie, cira, coconut, gwen, leo, millie, rumi, tecolote, tibbit ];
    const randomBoard = boards[Math.floor(Math.random() * boards.length)];
    const selectedCatPatterns = getDistinctRandomNumbers(3, 0, catGoals.length - 1);
    this.state = {
      selectedBoard: randomBoard,
      catGoals: [
        catGoals[selectedCatPatterns[0]],
        catGoals[selectedCatPatterns[1]],
        catGoals[selectedCatPatterns[2]],
      ],
    };
  }

  render() {
    const { catGoals } = this.state;
    return (
      <div className="App" >
          <div className="setup-area">
            <img src={catGoals[0]} />
            <img src={catGoals[1]} />
            <img src={catGoals[2]} />
            <HexGrid width={1200} height={100} viewBox="-50 -50 100 100">
              <SetupArea />
            </HexGrid>
          </div>
        <div className="game-board" style={{ backgroundImage: `url(${this.state.selectedBoard})` }}>
          <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
            <GameBoard />
          </HexGrid>
        </div>
      </div>
    );
  }
}

export default App;
