import { Component, createContext, ReactNode } from 'react';
import { Tile } from './Tile';
import { Hex, HexUtils } from 'react-hexgrid';
import { getDistinctRandomNumbers, getSingleRandomNumber } from './helperMethods';

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

const TILES_PLAYED_END_GAME : number = 22;

export enum PlayState {
  START,
  TILE_SELECTED,
  TILE_INITIAL_PLACED,
  TILE_PLACED,
  TILE_DRAWN,
  END,
}

export enum ActionType {
  BUTTON,
  CAT,
  TILE,
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
  playState: PlayState;
  tilesPlaced: number;
  otherPlayerCount: number;
  activeTile: Tile | undefined;
  activeSelectedSpot: Hex | undefined;
  activeButton: string | undefined;
  activeCatGoal: string | undefined;
  buttonsPlayed: ButtonsPlayed;
  catsPlayed: ButtonsPlayed;
  showScoreModal: boolean;
}

export interface GameContextProps {
  state: GameState;
  updateBoardAndPlayerTiles: (hexagons: Hex[], tiles: Tile[]) => void;
  refillPool: (id: number) => void;
  setActiveAction: (action: ActionType, activeThing: string | Tile | undefined) => void;
  setBoardHexImage: (initialSelection: boolean, targetHex: Hex, image?: string | undefined) => void;
  setActiveSelectedSpot: (hex?: Hex | undefined) => void;
  addButton: (color: string, position: Position) => void;
  addCatButton: (cat: string, position: Position) => void;
  setShowScoreModal: (show: boolean) => void;
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
  const catGoals = [
    [[ callie, millie ], [ rumi, tibbit ]],
    [[ coconut, tecolote ], [ almond, cira ]],
    [[ gwen, leo ]]
  ];
  const catGoal1: number[] = [getSingleRandomNumber(0, catGoals[0].length - 1), getSingleRandomNumber(0, 1)];
  const catGoal2: number[] = [getSingleRandomNumber(0, catGoals[1].length - 1), getSingleRandomNumber(0, 1)];
  const catGoal3: number[] = [getSingleRandomNumber(0, catGoals[2].length - 1), getSingleRandomNumber(0, 1)];

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
      catGoals[0][catGoal1[0]][catGoal1[1]],
      catGoals[1][catGoal2[0]][catGoal1[1]],
      catGoals[2][catGoal3[0]][catGoal1[1]],
    ],
    patterns: hexPatterns,
    goalIds: selectedGoalIds,
    allTiles: allTiles,
    playerTiles: [
      allTiles[starterTiles[0]],
      allTiles[starterTiles[1]],
    ],
    activeTile: undefined,
    activeSelectedSpot: undefined,
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
    },
    activeCatGoal: undefined,
    catsPlayed: {
      callie: [],
      millie: [],
      rumi: [],
      tibbit: [],
      coconut: [],
      tecolote: [],
      almond: [],
      cira: [],
      gwen: [],
      leo: [],
    },
    showScoreModal: false,
  };
}

export const GameContext = createContext<GameContextProps>({
  state: SetInitialGameState(),
  updateBoardAndPlayerTiles: (hexagons: Hex[], tiles: Tile[]) => {},
  setActiveAction: (action: ActionType, activeThing: string | Tile | undefined) => {},
  setBoardHexImage: (initialSelection: boolean, targetHex: Hex, image?: string | undefined) => {},
  setActiveSelectedSpot: (hex?: Hex | undefined) => {},
  refillPool: (id: number) => {},
  addButton: (color: string, position: Position) => {},
  addCatButton: (cat: string, position: Position) => {},
  setShowScoreModal: (show: boolean) => {},
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
        tilesPlaced: tilesPlaced,
        activeSelectedSpot: undefined,
        showScoreModal: playState === PlayState.END });
  };

  setActiveAction = (action: ActionType, activeThing: string | Tile | undefined): void => {
    if (this.state.activeSelectedSpot) {
      this.setBoardHexImage(false, this.state.activeSelectedSpot!);
      this.setActiveSelectedSpot(undefined);
    }
    let activeButton = undefined;
    let activeCatGoal = undefined;
    let activeTile = undefined;
    let playState = this.state.playState;
    switch (action) {
      case ActionType.BUTTON:
        activeButton = activeThing as string;
        break;
      case ActionType.CAT:
        activeCatGoal = activeThing as string;
        break;
      case ActionType.TILE:
        activeTile = activeThing as Tile;
        playState = PlayState.TILE_SELECTED;
        break;
    }

    this.setState({ 
      activeButton: activeButton,
      activeCatGoal: activeCatGoal,
      activeTile: activeTile,
      playState: playState });
  };

  setBoardHexImage = (initialSelection: boolean, targetHex: Hex, image?: string | undefined) => {
    const selectedSpot : Hex | undefined = this.state.boardHexagons.find(hex => HexUtils.equals(targetHex, hex));
    if (selectedSpot) {
      selectedSpot.image = image;
      selectedSpot.state = initialSelection ? 'selected' : undefined;
    }

    this.setState({ boardHexagons: this.state.boardHexagons });
  }
  
    setActiveSelectedSpot = (hex?: Hex | undefined): void => {
      this.setState({ activeSelectedSpot: hex, playState: PlayState.TILE_INITIAL_PLACED });
    };

  addButton = (color: string, position: Position): void => {
    this.state.buttonsPlayed[color].push(position);
    this.setState({ buttonsPlayed: this.state.buttonsPlayed, activeButton: undefined });
  };

  addCatButton = (cat: string, position: Position): void => {
    this.state.catsPlayed[cat].push(position);
    this.setState({ catsPlayed: this.state.catsPlayed, activeCatGoal: undefined });
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
    
    this.setState({
      playerTiles: this.state.playerTiles,
      poolTiles: this.state.poolTiles,
      allTiles: this.state.allTiles,
      playState: PlayState.TILE_DRAWN });
  };

  setShowScoreModal = (show: boolean): void => {
    this.setState({ showScoreModal: show });
  }

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
      setActiveSelectedSpot: this.setActiveSelectedSpot,
      setActiveAction: this.setActiveAction,
      setBoardHexImage: this.setBoardHexImage,
      refillPool: this.refillPool,
      addButton: this.addButton,
      addCatButton: this.addCatButton,
      setShowScoreModal: this.setShowScoreModal,
    };

    return (
      <GameContext.Provider value={contextValue}>
        {this.props.children}
      </GameContext.Provider>
    )
  }
}