import './SetupArea.css';
import React, { Component } from 'react';
import { Layout, Hexagon, HexGrid, Pattern, Hex } from 'react-hexgrid';
import clovers from './calico tiles/patterns/clovers.png';
import dots from './calico tiles/patterns/dots.png';
import ferns from './calico tiles/patterns/ferns.png';
import flowers from './calico tiles/patterns/flowers.png';
import stripes from './calico tiles/patterns/stripes.png';
import swirls from './calico tiles/patterns/swirls.png';
import { GameContext, GameContextProps } from './GameContext';

const config = {
  "layout": { "width": 45, "height": 45, "spacing": 1 },
  "origin": { "x": -510, "y": -10 },
}

class SetupArea extends Component {
  static contextType = GameContext;
  context!: React.ContextType<typeof GameContext>;

  render() {
    const size = { x: config.layout.width, y: config.layout.height };
    const spacing = config.layout.spacing;
    const innerSize = { x: config.layout.width-.75, y: config.layout.height };
    const { state } = this.context as GameContextProps;
    return (
      <div className="App">
        <div className="setup-area">
          <img src={state.catGoals[0]} draggable={false} />
          <img src={state.catGoals[1]} draggable={false} />
          <img src={state.catGoals[2]} draggable={false}/>
          <HexGrid width={1200} height={100} viewBox="-50 -50 100 100">
            <Layout size={size} flat={false} spacing={spacing} origin={config.origin}>
              {state.patterns.map((hex, index) => (
                <Hexagon
                  key={index}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  fill={ hex.image != null ? hex.image : undefined } />
                ))}
            </Layout>
            <Pattern id="clovers" size={innerSize} link={clovers} />
            <Pattern id="dots" size={innerSize} link={dots} />
            <Pattern id="ferns" size={innerSize} link={ferns} />
            <Pattern id="flowers" size={innerSize} link={flowers} />
            <Pattern id="stripes" size={innerSize} link={stripes} />
            <Pattern id="swirls" size={innerSize} link={swirls} />
          </HexGrid>
        </div>
      </div>
    );
  }
}

export default SetupArea;
