import './ScoreModal.css';
import React, { Component, useEffect } from 'react';
import { CatPointsMap, GameContext, GameContextProps } from './GameContext';
import buttonsScoreImg from './calico tiles/scoring/buttons-scoring.png';

class ScoreModal extends Component<{}, GameContextProps> {
  static contextType = GameContext;
  context!: React.ContextType<typeof GameContext>;

  render() {
    const { state, setShowScoreModal } = this.context;
    if (!state.showScoreModal) {
      return null;
    }

    return (
      <div className="score-modal">
        <div className="score-modal-content">
          <div className="close" onClick={() => setShowScoreModal(false)}>&times;</div>
          <h2>Score</h2>
          <table>
            <thead>
              <tr>
                <th className="col1">Item</th>
                <th className="col2">Count</th>
                <th className="col2">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col1">Buttons <br /><img key={'buttons'} src={buttonsScoreImg} width={'80px'} /></td>
                <td className="col2">{state.score.buttonsCount}</td>
                <td className="col2">{state.score.buttonsScore}</td>
              </tr>
              {
                Object.entries(state.score.cats).map(([catName, score]) => (
                  <tr key={`trc-${catName}`}>
                    <td className="col1" key={`tdc1-${catName}`}>{catName}<br /><img key={`score-${catName}`} src={CatPointsMap[catName][1]} width={'80px'} /></td>
                    <td className="col2" key={`tdc2-${catName}`}>{score.count}</td>
                    <td className="col2" key={`tdc3-${catName}`}>{score.points}</td>
                  </tr>
                ))
              }
              {
                Object.entries(state.score.bonusTiles).map(([index, score]) => (
                  <tr key={`tr-${index}`}>
                    <td className="col1" key={`td1-${index}`}><img key={`layout-${index}`} src={score[0]} width={'80px'} /></td>
                    <td className="col2" key={`td2-${index}`}></td>
                    <td className="col2" key={`td3-${index}`}>{score[1]}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <h2>Final Score: {state.score.total}</h2>
          <hr />
          <h2>My High Scores</h2>
          <table>
            <thead>
              <tr>
                <th className="col-score-date">Date</th>
                <th className="col-score">Score</th>
              </tr>
            </thead>
            <tbody>
              {
                state ? state.highScores.map((highScore, index) => (
                  <tr key={`hs-${index}`}>
                    <td className="col-score-date" key={`hs2-${index}`}>{highScore.timestamp}</td>
                    <td className="col-score" key={`hs1-${index}`}>{highScore.score}</td>
                  </tr>
                ))
                : <div />
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ScoreModal;