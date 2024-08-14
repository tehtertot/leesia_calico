import { v4 as uuidv4 } from 'uuid';
import { Component, createContext, ReactNode } from 'react';
import { Tile } from './Tile';
import { Hex, HexUtils } from 'react-hexgrid';
import { getCatNameFromImagePath, getDistinctRandomNumbers, getSingleRandomNumber } from './helperMethods';
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
// layout goals
import goal1 from './calico tiles/goals/1.png';
import goal2 from './calico tiles/goals/2.png';
import goal3 from './calico tiles/goals/3.png';
import goal4 from './calico tiles/goals/4.png';
import goal5 from './calico tiles/goals/5.png';
import goal6 from './calico tiles/goals/6.png';

// create a randomly generated guid
const gameId: string = uuidv4();
const TILES_PLAYED_END_GAME : number = 22;
const highScoresKey = "calicoHighScores";
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type CatPointsMapType = { [key: string]: [number, string] };
export const CatPointsMap: CatPointsMapType =
{
  "callie": [3, callie],
  "millie": [3, millie],
  "rumi": [5, rumi],
  "tibbit": [5, tibbit],
  "coconut": [7, coconut],
  "tecolote": [7, tecolote],
  "almond": [9, almond],
  "cira": [9, cira],
  "gwen": [11, gwen],
  "leo": [11, leo],
};

function saveHighScores(score: FinalScore) {
  let currentScores = loadHighScores();
  const currentGameScoreIndex = currentScores.findIndex((score: FinalScore) => score.gameId === score.gameId);
  if (currentGameScoreIndex > -1) {
    currentScores[currentGameScoreIndex] = score;
  }
  else {
    currentScores.push(score);
  }
  currentScores = currentScores.sort((a: FinalScore, b: FinalScore) => b.score - a.score);
  currentScores.length = Math.min(currentScores.length, 3);
  localStorage.setItem(highScoresKey, JSON.stringify(currentScores));
}

function loadHighScores(): FinalScore[] {
  const currentScores = localStorage.getItem(highScoresKey);
  return currentScores ? JSON.parse(currentScores) : [];
}

export enum PlayState {
  START,
  TILE_SELECTED,
  TILE_INITIAL_PLACED,
  TILE_PLACED,
  OTHER_PLAYER,
  OTHER_PLAYER_DONE,
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

export interface FinalScore {
  gameId: string;
  score: number;
  timestamp: string;
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
  poolTiles: (Tile | null)[];
  playState: PlayState;
  tilesPlaced: number;
  otherPlayerChoice: number;
  otherPlayerCount: number;
  activeTile: Tile | undefined;
  activeSelectedSpot: Hex | undefined;
  activeButton: string | undefined;
  activeCatGoal: string | undefined;
  buttonsPlayed: ButtonsPlayed;
  catsPlayed: ButtonsPlayed;
  showScoreModal: boolean;
  score: IScore;
  highScores: FinalScore[];
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
  saveScore: (score: number) => void;
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

  const highScores = loadHighScores();

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
    otherPlayerChoice: 0,
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
    score: {
      buttonsCount: 0,
      buttonsScore: 0,
      cats: {},
      bonusTiles: [],
      total: 0,
    },
    highScores: highScores,
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
  saveScore: (score: number) => {},
});

interface IScore {
  buttonsCount: number;
  buttonsScore: number;
  cats: CatPointsScoreType;
  bonusTiles: LayoutTileScoreType[];
  total: number;
}

type CatPointsScoreType = { [key: string]: { count: number, points: number } };
type LayoutTileScoreType = [string, number];

export class GameProvider extends Component<{ children: ReactNode }, GameState> {
  state: GameState = SetInitialGameState() as GameState;
  
  calculateScore = (isEnd: boolean): void => {
    const buttonPoints = this.calculateButtonScore();
    const catPoints = this.calculateCatScore();
    const layoutPoints = this.calculateLayoutTileScores();
    const total = buttonPoints + catPoints + layoutPoints;
    this.state.score.total = total;
    if (isEnd)
    {
      this.saveScore(total);
    }
  };

  calculateButtonScore = (): number => {
    let points = 0;
    let count = 0;
    Object.values(this.state.buttonsPlayed).forEach((button) => {
      points += 3 * button.length;
      count += button.length;
    });
    this.state.score.buttonsCount = count;
    this.state.score.buttonsScore = points;
    return points;
  };

  calculateCatScore(): number {
    const catGoals = this.state.catGoals;
    const catScore: CatPointsScoreType = {};
    let totalPoints = 0;
    catGoals.forEach((catGoal) => {
      const catName = getCatNameFromImagePath(catGoal);
      const count = this.state.catsPlayed[catName].length;
      const points = CatPointsMap[catName][0] * count;
      totalPoints += points;
      this.state.score.cats[catName] = {
        count,
        points,
      };
    });
    return totalPoints;
  }

  calculateLayoutTileScores = (): number => {
    this.state.score.bonusTiles = [];
    this.state.score.bonusTiles.push(this.calculateLayoutTileScore(0, this.state.goalIds[0]));
    this.state.score.bonusTiles.push(this.calculateLayoutTileScore(1, this.state.goalIds[1]));
    this.state.score.bonusTiles.push(this.calculateLayoutTileScore(2, this.state.goalIds[2]));
    return this.state.score.bonusTiles.reduce((acc, cur) => acc + cur[1], 0);
  }

  calculateLayoutTileScore = (goalIndex: number, goalId: number): LayoutTileScoreType => {
    const neighbors = this.getHexagonsAroundScoreTile(goalIndex);
    let pattern = [0, 0, 0, 0, 0, 0];
    let colorList = ["darkBlue", "green", "lightBlue", "pink", "purple", "yellow"];
    let color = [0, 0, 0, 0, 0, 0];
    let gotPatternPoints = false;
    let gotColorPoints = false;
    neighbors.forEach((hex) => {
      const tileInfo = hex.image?.split('x-')[1];
      const patternId = tileInfo ? tileInfo[tileInfo?.length - 1] : undefined;
      const colorName = tileInfo ? tileInfo?.slice(0, -1) : undefined;
      if (patternId !== undefined) {
        pattern[parseInt(patternId) - 1]++;
      }

      if (colorName !== undefined) {
        const colorIndex = colorList.indexOf(colorName);
        color[colorIndex]++;
      }
    });

    if (goalId === 0) {
      // pattern "AAA-BB-C"
      if (pattern.includes(3) && pattern.includes(2) && pattern.includes(1)) {
        gotPatternPoints = true;
      }
      
      if (color.includes(3) && color.includes(2) && color.includes(1)) {
        gotColorPoints = true;
      }
      // points: [7, 11]
      const points = gotPatternPoints && gotColorPoints ? 11 : gotPatternPoints || gotColorPoints ? 7 : 0;
      return [goal1, points];
    }
    else if (goalId === 1) {
      // pattern: "<>",
      if (pattern.every(value => value === 1)) {
        gotPatternPoints = true;
      }
      if (color.every(value => value === 1)) {
        gotColorPoints = true;
      }
      // points: [10, 15]
      const points = gotPatternPoints && gotColorPoints ? 15 : gotPatternPoints || gotColorPoints ? 10 : 0;
      return [goal2, points];
    }
    else if (goalId === 2) {
      // pattern: "AAAA-BB",
      if (pattern.includes(4) && pattern.includes(2)) {
        gotPatternPoints = true;
      }
      if (color.includes(4) && color.includes(2)) {
        gotColorPoints = true;
      }
      // points: [8, 14]
      const points = gotPatternPoints && gotColorPoints ? 14 : gotPatternPoints || gotColorPoints ? 8 : 0;
      return [goal3, points];
    }
    else if (goalId === 3) {
      // pattern: "AA-BB-C-D"
      if (pattern.filter(value => value === 2).length === 2 && pattern.filter(value => value === 1).length === 2) {
        gotPatternPoints = true;
      }
      if (color.filter(value => value === 2).length === 2 && color.filter(value => value === 1).length === 2) {
        gotColorPoints = true;
      }
      // points: [5, 8]
      const points = gotPatternPoints && gotColorPoints ? 8 : gotPatternPoints || gotColorPoints ? 5 : 0;
      return [goal4, points];
    }
    else if (goalId === 4) {
      // pattern: "AAA-BBB"
      if (pattern.filter(value => value === 3).length === 2) {
        gotPatternPoints = true;
      }
      if (color.filter(value => value === 3).length === 2) {
        gotColorPoints = true;
      }
      // points: [8, 13]
      const points = gotPatternPoints && gotColorPoints ? 13 : gotPatternPoints || gotColorPoints ? 8 : 0;
      return [goal5, points];
    }
    else if (goalId === 5) {
      // pattern: "AA-BB-CC"
      if (pattern.filter(value => value === 2).length === 3) {
        gotPatternPoints = true;
      }
      if (color.filter(value => value === 2).length === 3) {
        gotColorPoints = true;
      }
      // points: [7, 11]
      const points = gotPatternPoints && gotColorPoints ? 11 : gotPatternPoints || gotColorPoints ? 7 : 0;
      return [goal6, points];
    }

    return ["", 0];
  }

  getHexagonsAroundScoreTile = (goalIndex: number): Hex[] => {
    const specificIndexes =
      goalIndex === 0 ? [1, 2, 6, 8, 11, 12] :
      goalIndex === 1 ? [8, 9, 12, 14, 18, 19] :
      goalIndex === 2 ? [10, 11, 15, 17, 20, 21] : [];
    const neighbors = specificIndexes.map(index => this.state.boardHexagons[index]);
    return neighbors;
  };

  updateBoardAndPlayerTiles = (hexagons: Hex[], tiles: Tile[]): void => {
      const tilesPlaced = this.state.tilesPlaced + 1;
      const playState = tilesPlaced === TILES_PLAYED_END_GAME ? PlayState.END : PlayState.TILE_PLACED;
      if (playState === PlayState.END) {
        this.calculateScore(true);
      }

      this.setState({
        boardHexagons: hexagons,
        activeTile: undefined,
        playerTiles: tiles,
        playState: playState,
        tilesPlaced: tilesPlaced,
        activeSelectedSpot: undefined,
        showScoreModal: playState === PlayState.END });
  };

  saveScore = (score: number): void => {
    const currentDate = (new Date()).toDateString();
    saveHighScores({ gameId: gameId, score: score, timestamp: currentDate });
    this.setState({ highScores: loadHighScores()});
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

  refillPool = async (index: number): Promise<void> => {
    if (this.state.allTiles.length === 0) {
      throw new Error("No more tiles available");
    }
    
    // add player's tile to their pool
    const playerChosenTile = this.state.poolTiles[index]!;
    this.state.poolTiles[index] = null;
    this.state.playerTiles.push(playerChosenTile);
    this.setState({ playerTiles: this.state.playerTiles, poolTiles: this.state.poolTiles });
    await delay(100);
    
    // draw a new tile for the general pool
    const randomIndex = this.getAvailableTileIndex();
    this.state.allTiles[randomIndex].isUsed = true;
    const tile = this.state.allTiles[randomIndex];
    this.state.poolTiles[index] = tile;
    this.setState({ poolTiles: this.state.poolTiles });
    await delay(200);
    
    for (let p = 0; p < this.state.otherPlayerCount; p++) {
      const randomIndexFromPool = getSingleRandomNumber(0, this.state.poolTiles.length - 1);
      
      // do a cat animation to remove one of the pool tiles
      this.setState({ playState: PlayState.OTHER_PLAYER, otherPlayerChoice: randomIndexFromPool });
      await delay(300);
      
      this.state.poolTiles[randomIndexFromPool] = null;
      this.setState({ poolTiles: this.state.poolTiles, playState: PlayState.OTHER_PLAYER_DONE });
      await delay(300);
      
      const newTileIndex = this.getAvailableTileIndex();
      this.state.allTiles[newTileIndex].isUsed = true;
      const newTile = this.state.allTiles[newTileIndex];
      this.state.poolTiles[randomIndexFromPool] = newTile;
      
      this.setState({ playState: PlayState.OTHER_PLAYER_DONE, poolTiles: this.state.poolTiles });
    }
    
    this.setState({
      playerTiles: this.state.playerTiles,
      poolTiles: this.state.poolTiles,
      allTiles: this.state.allTiles,
      playState: PlayState.START });
  };

  setShowScoreModal = (show: boolean): void => {
    this.calculateScore(this.state.playState === PlayState.END);
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
      saveScore: this.saveScore,
    };

    return (
      <GameContext.Provider value={contextValue}>
        {this.props.children}
      </GameContext.Provider>
    )
  }
}