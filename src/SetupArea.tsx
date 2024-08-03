import './SetupArea.css';
import React, { Component } from 'react';
import { Layout, Hexagon, HexUtils, Pattern, Hex } from 'react-hexgrid';
import { getDistinctRandomNumbers } from './helperMethods';
import clovers from './calico tiles/patterns/clovers.png';
import dots from './calico tiles/patterns/dots.png';
import ferns from './calico tiles/patterns/ferns.png';
import flowers from './calico tiles/patterns/flowers.png';
import stripes from './calico tiles/patterns/stripes.png';
import swirls from './calico tiles/patterns/swirls.png';

const config = {
  "layout": { "width": 45, "height": 45, "spacing": 1 },
  "origin": { "x": -510, "y": -10 },
}

interface SetupAreaState {
  patterns: Hex[];
}

const patterns = [ "clovers", "dots", "ferns", "flowers", "stripes", "swirls" ];
class SetupArea extends Component<{}, SetupAreaState> {
  constructor(props: {}) {
    super(props);
    const patternIds = getDistinctRandomNumbers(6, 0, 5);
    const hexPatterns : Hex[] = [
      { q: 0, r: 0, s: 0, image: patterns[patternIds[0]] },
      { q: 1.4, r: 0, s: -1, image: patterns[patternIds[1]] },
      { q: 3.55, r: 0, s: -2, image: patterns[patternIds[2]] },
      { q: 5, r: 0, s: -3, image: patterns[patternIds[3]] },
      { q: 7.15, r: 0, s: -4, image: patterns[patternIds[4]] },
      { q: 8.6, r: 0, s: -5, image: patterns[patternIds[5]] },
    ];
    this.state = { patterns: hexPatterns };
  }

  render() {
    const size = { x: config.layout.width, y: config.layout.height };
    const spacing = config.layout.spacing;
    const innerSize = { x: config.layout.width-.75, y: config.layout.height };
    return (
      <React.Fragment>
        <div>
        </div>
        <Layout size={size} flat={false} spacing={spacing} origin={config.origin}>
          {this.state.patterns.map((hex, index) => (
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
      </React.Fragment>
    );
  }
}

export default SetupArea;
