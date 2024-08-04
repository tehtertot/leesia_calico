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

const TILES_PLAYED_END_GAME : number = 21;

export enum PlayState {
  START,
  TILE_SELECTED,
  TILE_PLACED,
  TILE_DRAWN,
  END,
}

export enum ButtonColor {
  DARK_BLUE = "darkBlue",
  GREEN = "green",
  LIGHT_BLUE = "lightBlue",
  PINK = "pink",
  PURPLE = "purple",
  YELLOW = "yellow",
  RAINBOW = "rainbow",
}

export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

type ButtonsPlayed = {
  [key: string] : Position[];
}

export interface GameState {
  goalIds: number[];
  selectedBoard: string;
  playerColor: string;
  boardHexagons: Hex[];
  catGoals: string[];
  patterns: Hex[];
  allTiles: Tile[];
  playerTiles: Tile[];
  poolTiles: Tile[];
  activeTile: Tile | undefined;
  playState: PlayState;
  tilesPlaced: number;
  otherPlayerCount: number;
  activeButton: string | undefined;
  buttonsPlayed: ButtonsPlayed;
}

export interface GameContextProps {
  state: GameState;
  updateBoardAndPlayerTiles: (hexagons: Hex[], tiles: Tile[]) => void;
  setActiveTile: (tile?: Tile | undefined) => void;
  refillPool: (id: number) => void;
  setActiveButton: (button: string | undefined) => void;
  addButton: (color: string, position: Position) => void;
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
    { q: 0, r: 1, s: -1, },
    { q: 1, r: 1, s: -2, image: goals[selectedGoalIds[0]], blocked: true },
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
  const catGoals = [[ callie, millie ], [ rumi, tibbit ], [ coconut, tecolote ], [ almond, cira ], [ gwen, leo ]];
  const selectedCatPatterns = getDistinctRandomNumbers(3, 0, catGoals.length - 1).sort((a, b) => a - b);
  const catGoal1 = getDistinctRandomNumbers(1, 0, 1);
  const catGoal2 = getDistinctRandomNumbers(1, 0, 1);
  const catGoal3 = getDistinctRandomNumbers(1, 0, 1);

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
      catGoals[selectedCatPatterns[0]][catGoal1[0]],
      catGoals[selectedCatPatterns[1]][catGoal2[0]],
      catGoals[selectedCatPatterns[2]][catGoal3[0]],
    ],
    patterns: hexPatterns,
    goalIds: selectedGoalIds,
    allTiles: allTiles,
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
    playState: PlayState.START,
    tilesPlaced: 0,
    otherPlayerCount: 1,
    activeButton: undefined,
    buttonsPlayed: {
      darkBlue: [],
      green: [],
      lightBlue: [],
      pink: [],
      purple: [],
      yellow: [],
      rainbow: [],
    }
  };
}

export const GameContext = createContext<GameContextProps>({
  state: SetInitialGameState(),
  updateBoardAndPlayerTiles: (hexagons: Hex[], tiles: Tile[]) => {},
  setActiveTile: (tile?: Tile | undefined) => {},
  refillPool: (id: number) => {},
  setActiveButton: (button: string | undefined) => {},
  addButton: (color: string, position: Position) => {},
});

export class GameProvider extends Component<{ children: ReactNode }, GameState> {
  state: GameState = SetInitialGameState() as GameState;
  
  updateBoardAndPlayerTiles = (hexagons: Hex[], tiles: Tile[]): void => {
      const tilesPlaced = this.state.tilesPlaced + 1;
      const playState = tilesPlaced === TILES_PLAYED_END_GAME ? PlayState.END : PlayState.TILE_PLACED;
      this.setState({
        boardHexagons: hexagons,
        activeTile: undefined,
        playerTiles: tiles,
        playState: playState,
        tilesPlaced: tilesPlaced });
  };

  setActiveTile = (tile?: Tile | undefined): void => {
    this.setState({ activeTile: tile, playState: PlayState.TILE_SELECTED });
  };

  setActiveButton = (button: string | undefined): void => {
    this.setState({ activeButton: button });
  };

  addButton = (color: string, position: Position): void => {
    const buttonsPlayed = this.state.buttonsPlayed;
    buttonsPlayed[color].push(position);
    this.setState({ buttonsPlayed: buttonsPlayed, activeButton: undefined });
  };

  refillPool = (index: number): void => {
    if (this.state.allTiles.length === 0) {
      throw new Error("No more tiles available");
    }

    const playerChosenTile = this.state.poolTiles.splice(index, 1);
    this.state.playerTiles.push(playerChosenTile[0]);

    // draw a new tile for the pool
    const randomIndex = this.getAvailableTileIndex();
    this.state.allTiles[randomIndex].isUsed = true;
    const tile = this.state.allTiles[randomIndex];
    this.state.poolTiles.push(tile);
    
    for (let p = 0; p < this.state.otherPlayerCount; p++) {
      const otherPlayerChosenTile = this.state.poolTiles.splice(index, 1);
      
      const newTileIndex = this.getAvailableTileIndex();
      this.state.allTiles[newTileIndex].isUsed = true;
      const newTile = this.state.allTiles[newTileIndex];
      // do a cat animation to remove one of the pool tiles
      this.state.poolTiles.push(newTile);
    }
    
    this.setState({ playerTiles: this.state.playerTiles, poolTiles: this.state.poolTiles, allTiles: this.state.allTiles, playState: PlayState.TILE_DRAWN });
  };

  getAvailableTileIndex = (): number => {
    let randomIndex = Math.floor(Math.random() * this.state.allTiles.length);
    while (this.state.allTiles[randomIndex].isUsed) {
      randomIndex = Math.floor(Math.random() * this.state.allTiles.length);
    }
    return randomIndex;
  }

  render() {
    const contextValue: GameContextProps = {
      state: this.state,
      updateBoardAndPlayerTiles: this.updateBoardAndPlayerTiles,
      setActiveTile: this.setActiveTile,
      setActiveButton: this.setActiveButton,
      refillPool: this.refillPool,
      addButton: this.addButton,
    };

    return (
      <GameContext.Provider value={contextValue}>
        {this.props.children}
      </GameContext.Provider>
    )
  }
}