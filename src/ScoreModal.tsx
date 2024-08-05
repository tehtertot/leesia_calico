import React, { Component } from 'react';
import { GameContext, GameContextProps } from './GameContext';
import buttonsScoreImg from './calico tiles/scoring/buttons-scoring.png';
import { getCatNameFromImagePath } from './helperMethods';
import almond from './calico tiles/catPoints/almond.png';
import callie from './calico tiles/catPoints/callie.png';
import cira from './calico tiles/catPoints/cira.png';
import coconut from './calico tiles/catPoints/coconut.png';
import gwen from './calico tiles/catPoints/gwen.png';
import leo from './calico tiles/catPoints/leo.png';
import millie from './calico tiles/catPoints/millie.png';
import rumi from './calico tiles/catPoints/rumi.png';
import tecolote from './calico tiles/catPoints/tecolote.png';
import tibbit from './calico tiles/catPoints/tibbit.png';
import goal1 from './calico tiles/goals/1.png';
import goal2 from './calico tiles/goals/2.png';
import goal3 from './calico tiles/goals/3.png';
import goal4 from './calico tiles/goals/4.png';
import goal5 from './calico tiles/goals/5.png';
import goal6 from './calico tiles/goals/6.png';
import { Hex } from 'react-hexgrid';

type CatPointsMapType = { [key: string]: [number, string] };
const CatPointsMap: CatPointsMapType =
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

interface IScore {
  buttonsCount: number;
  buttonsScore: number;
  cats: CatPointsScoreType;
  bonusTiles: LayoutTileScoreType[];
}

type CatPointsScoreType = { [key: string]: { count: number, points: number } };
type LayoutTileScoreType = [string, number];

class ScoreModal extends Component<{}, GameContextProps> {
  static contextType = GameContext;
  context!: React.ContextType<typeof GameContext>;
  score: IScore;

  constructor(props: {}, score: IScore) {
    super(props);
    
    this.score = {
      buttonsCount: 0,
      buttonsScore: 0,
      cats: {},
      bonusTiles: [],
    };
  }
  

  calculateScore() {
    const { state } = this.context;
    this.calculateButtonScore();
    this.calculateCatScore();
    this.calculateLayoutTileScores();
  }
  
  calculateButtonScore(): void {
    const { state } = this.context;
    let points = 0;
    let count = 0;
    Object.values(state.buttonsPlayed).forEach((button) => {
      points += 3 * button.length;
      count += button.length;
    });
    this.score.buttonsCount = count;
    this.score.buttonsScore = points;
  }
  
  calculateCatScore(): void {
    const { state } = this.context;
    const catGoals = state.catGoals;
    const catScore: CatPointsScoreType = {};
    catGoals.forEach((catGoal) => {
      const catName = getCatNameFromImagePath(catGoal);
      const count = state.catsPlayed[catName].length;
      const points = CatPointsMap[catName][0] * count;
      this.score.cats[catName] = {
        count,
        points,
      };
    });
  }
  
  calculateLayoutTileScores(): void {
    const { state } = this.context;
    this.score.bonusTiles.push(this.calculateLayoutTileScore(0, state.goalIds[0]));
    this.score.bonusTiles.push(this.calculateLayoutTileScore(1, state.goalIds[1]));
    this.score.bonusTiles.push(this.calculateLayoutTileScore(2, state.goalIds[2]));
  }

  calculateLayoutTileScore(goalIndex: number, goalId: number): LayoutTileScoreType {
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
      if (pattern.filter(value => value === 3).length === 3) {
        gotPatternPoints = true;
      }
      if (color.filter(value => value === 3).length === 3) {
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

  getHexagonsAroundScoreTile(goalIndex: number): Hex[] {
    const { state } = this.context;
    const specificIndexes =
      goalIndex === 0 ? [1, 2, 6, 8, 11, 12] :
      goalIndex === 1 ? [8, 9, 12, 14, 18, 19] :
      goalIndex === 2 ? [10, 11, 15, 17, 20, 21] : [];
    const neighbors = specificIndexes.map(index => state.boardHexagons[index]);
    return neighbors;
  }

  render() {
    this.calculateScore();
    const { setShowScoreModal } = this.context;
    return (
      <div className="score-modal">
        <div className="score-modal-content">
          <span className="close" onClick={() => setShowScoreModal(false)}>&times;</span>
          <h2>Score</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Count</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Buttons <br /><img key={'buttons'} src={buttonsScoreImg} width={'80px'} /></td>
                <td>{this.score.buttonsCount}</td>
                <td>{this.score.buttonsScore}</td>
              </tr>
              {
                Object.entries(this.score.cats).map(([catName, score]) => (
                  <tr>
                    <td>{catName}<br /><img key={`score-${catName}`} src={CatPointsMap[catName][1]} width={'80px'} /></td>
                    <td>{score.count}</td>
                    <td>{score.points}</td>
                  </tr>
                ))
              }
              {
                Object.entries(this.score.bonusTiles).map(([index, score]) => (
                  <tr>
                    <td><img key={`layout-${index}`} src={score[0]} width={'80px'} /></td>
                    <td></td>
                    <td>{score[1]}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ScoreModal;