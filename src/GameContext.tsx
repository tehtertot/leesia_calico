import React, { Component, createContext, ReactNode } from 'react';
import { Tile } from './Tile';
import { Hex } from 'react-hexgrid';
import { getDistinctRandomNumbers } from './helperMethods';

// boards
import blue from './calico tiles/boards/blue.jpg';
import green from './calico tiles/boards/green.jpg';
import purple from './calico tiles/boards/purple.jpg';
import yellow from './calico tiles/boards/yellow.jpg';
// cat goals
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

export interface GameState {
  goalIds: number[];
  selectedBoard: string;
  playerColor: string;
  boardHexagons: Hex[];
  catGoals: string[];
  patterns: Hex[];
  availableTiles: Tile[];
  playerTiles: Tile[];
  poolTiles: Tile[];
  activeTile: Tile | undefined;
}

export interface GameContextProps {
  state: GameState;
  updateBoard: (hexagons: Hex[]) => void;
  updatePlayerTiles: (tiles: Tile[]) => void;
  setActiveTile: (tile?: Tile | undefined) => void;
  drawAvailableTileForPool: (id: number) => void;
  drawFromPool(tile: Tile): void;
}

function SetInitialGameState(): GameState {
  const goals = [ "goal1", "goal2", "goal3", "goal4", "goal5", "goal6" ];
  const selectedGoalIds = getDistinctRandomNumbers(3, 0, 5);
  
  // set the board
  const boards = [ blue, green, purple, yellow ];
  const boardIndex = Math.floor(Math.random() * boards.length);
  const randomBoard = boards[boardIndex];
  const boardColor = boardIndex === 0 ? "blue" : boardIndex === 1 ? "green" : boardIndex === 2 ? "purple" : "yellow";
  const boardHexagons = [
    { q: 0, r: 0, s: 0, },
    { q: 1, r: 0, s: -1, },
    { q: 2, r: 0, s: -2, },
    { q: 3, r: 0, s: -3, },
    { q: 4, r: 0, s: -4, },
    
    { q: -1, r: 1, s: 0, },
    { q: 0, r: 1, s: 0, },
    { q: 1, r: 1, s: 0, image: goals[selectedGoalIds[0]], blocked: true },
    { q: 2, r: 1, s: -3, },
    { q: 3, r: 1, s: -4, },
    
    { q: -1, r: 2, s: 0, },
    { q: 0, r: 2, s: -1, },
    { q: 1, r: 2, s: -2, },
    { q: 2, r: 2, s: -3, image: goals[selectedGoalIds[1]], blocked: true },
    { q: 3, r: 2, s: -4, },
    
    { q: -2, r: 3, s: 0, },
    { q: -1, r: 3, s: -1, image: goals[selectedGoalIds[2]], blocked: true },
    { q: 0, r: 3, s: -2, },
    { q: 1, r: 3, s: -3, },
    { q: 2, r: 3, s: -4, },
    
    { q: -2, r: 4, s: 0, },
    { q: -1, r: 4, s: -1, },
    { q: 0, r: 4, s: -2, },
    { q: 1, r: 4, s: -3, },
    { q: 2, r: 4, s: -4, },
  ];

  // set the cat goals
  const catGoals = [ almond, callie, cira, coconut, gwen, leo, millie, rumi, tecolote, tibbit ];
  const selectedCatPatterns = getDistinctRandomNumbers(3, 0, catGoals.length - 1);
  const patterns = [ "clovers", "dots", "ferns", "flowers", "stripes", "swirls" ];
  const patternIds = getDistinctRandomNumbers(6, 0, 5);
  const hexPatterns : Hex[] = [
    { q: 0, r: 0, s: 0, image: patterns[patternIds[0]] },
    { q: 1.4, r: 0, s: -1, image: patterns[patternIds[1]] },
    { q: 3.55, r: 0, s: -2, image: patterns[patternIds[2]] },
    { q: 5, r: 0, s: -3, image: patterns[patternIds[3]] },
    { q: 7.15, r: 0, s: -4, image: patterns[patternIds[4]] },
    { q: 8.6, r: 0, s: -5, image: patterns[patternIds[5]] },
  ];

  // create all tiles
  const colors = ["darkBlue", "green", "lightBlue", "pink", "purple", "yellow"];
  const allTiles: Tile[] = [];
  let id = 0;
  for (const color of colors) {
    for (let patternId = 1; patternId <= 6; patternId++) {
      for (let j = 0; j < 3; j++) {
        const tile = new Tile(patternId, color, id++);
        allTiles.push(tile);
      }
    }
  }

  const starterTiles = getDistinctRandomNumbers(5, 0, allTiles.length - 1);
  // set player tiles
  allTiles[starterTiles[0]].isUsed = true;
  allTiles[starterTiles[1]].isUsed = true;
  // set pool tiles
  allTiles[starterTiles[2]].isUsed = true;
  allTiles[starterTiles[3]].isUsed = true;
  allTiles[starterTiles[4]].isUsed = true;

  return {
    selectedBoard: randomBoard,
    playerColor: boardColor,
    boardHexagons: boardHexagons,
    catGoals: [
      catGoals[selectedCatPatterns[0]],
      catGoals[selectedCatPatterns[1]],
      catGoals[selectedCatPatterns[2]],
    ],
    patterns: hexPatterns,
    goalIds: selectedGoalIds,
    availableTiles: allTiles,
    playerTiles: [
      allTiles[starterTiles[0]],
      allTiles[starterTiles[1]],
    ],
    activeTile: undefined,
    poolTiles: [
      allTiles[starterTiles[2]],
      allTiles[starterTiles[3]],
      allTiles[starterTiles[4]],
    ],
  };
}

export const GameContext = createContext<GameContextProps>({
  state: SetInitialGameState(),
  updateBoard: (hexagons: Hex[]) => {},
  updatePlayerTiles: (tiles: Tile[]) => {},
  setActiveTile: (tile?: Tile | undefined) => {},
  drawAvailableTileForPool: (id: number) => {},
  drawFromPool: (tile: Tile) => {},
});

export class GameProvider extends Component<{ children: ReactNode }, GameState> {
  state: GameState = SetInitialGameState() as GameState;
  
  updateBoard = (hexagons: Hex[]): void => {
      this.setState({ boardHexagons: hexagons });
  };

  updatePlayerTiles = (tiles: Tile[]): void => {
    this.setState({ playerTiles: tiles });
  };

  setActiveTile = (tile?: Tile | undefined): void => {
    this.setState({ activeTile: tile });
  };

  drawAvailableTileForPool = (id: number): void => {
    if (this.state.availableTiles.length === 0) {
      throw new Error("No more tiles available");
    }

    let randomIndex = Math.floor(Math.random() * this.state.availableTiles.length);
    while (this.state.availableTiles[randomIndex].isUsed) {
      randomIndex = Math.floor(Math.random() * this.state.availableTiles.length);
    }
    const tile = this.state.availableTiles[randomIndex];
    this.state.availableTiles[randomIndex].isUsed = true;
    this.state.poolTiles = this.state.poolTiles.filter(tile => tile.id !== id);
    this.state.poolTiles.push(tile);
    this.setState({ availableTiles: this.state.availableTiles, poolTiles: this.state.poolTiles });
  };

  drawFromPool = (tile: Tile): void => {
    if (this.state.playerTiles.length === 1) {
      this.state.playerTiles.push(tile);
    }
  };

  render() {
    const contextValue: GameContextProps = {
      state: this.state,
      updateBoard: this.updateBoard,
      updatePlayerTiles: this.updatePlayerTiles,
      setActiveTile: this.setActiveTile,
      drawAvailableTileForPool: this.drawAvailableTileForPool,
      drawFromPool: this.drawFromPool,
    };

    return (
      <GameContext.Provider value={contextValue}>
        {this.props.children}
      </GameContext.Provider>
    )
  }
}