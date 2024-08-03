import React, { Component } from 'react';
import { Layout, Hexagon, HexUtils, Pattern } from 'react-hexgrid';
import './GameLayout.css';
import goal1 from './calico tiles/goals/1.png';
import goal2 from './calico tiles/goals/2.png';
import goal3 from './calico tiles/goals/3.png';
import goal4 from './calico tiles/goals/4.png';
import goal5 from './calico tiles/goals/5.png';
import goal6 from './calico tiles/goals/6.png';

const config = {
  "width": 1000,
  "height": 800,
  "layout": { "width": 6.25, "height": 6.25, "flat": true, "spacing": 1.02 },
  "origin": { "x": -56, "y": -39.5 },
  "map": "hexagon",
  "mapProps": [4]
}

interface ActionAreaState {
  
}

class ActionArea extends Component<{}, ActionAreaState> {
  constructor(props: {}) {
    super(props);
  }

  // onDragStart(event, source) {
  //   // If this tile is empty, let's disallow drag
  //   if (!source.props.data.text) {
  //     event.preventDefault();
  //   }
  // }

  render() {
    const size = { x: config.layout.width, y: config.layout.height };
    const innerSize = { x: config.layout.width-.75, y: config.layout.height };
    return (
        <Layout size={size} flat={false} spacing={1.02} origin={config.origin}>
        <Pattern id="goal1" size={innerSize} link={goal1} />
        <Pattern id="goal2" size={innerSize} link={goal2} />
        <Pattern id="goal3" size={innerSize} link={goal3} />
        <Pattern id="goal4" size={innerSize} link={goal4} />
        <Pattern id="goal5" size={innerSize} link={goal5} />
        <Pattern id="goal6" size={innerSize} link={goal6} />
        </Layout>
    );
  }
}

export default ActionArea;
