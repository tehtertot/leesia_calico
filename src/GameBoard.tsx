import React, { Component } from 'react';
import { Layout, Hex, Hexagon, HexUtils, Pattern } from 'react-hexgrid';
import { getDistinctRandomNumbers } from './helperMethods';
import './GameBoard.css';
import goal1 from './calico tiles/goals/1.png';
import goal2 from './calico tiles/goals/2.png';
import goal3 from './calico tiles/goals/3.png';
import goal4 from './calico tiles/goals/4.png';
import goal5 from './calico tiles/goals/5.png';
import goal6 from './calico tiles/goals/6.png';
import TargetProps, { HexagonProps } from 'react-hexgrid/lib/Hexagon/Hexagon';
import { HexCoordinates } from 'react-hexgrid/lib/models/Hex';

const config = {
  "width": 1000,
  "height": 800,
  "layout": { "width": 7.1, "height": 7.1, "flat": true, "spacing": 1.2 },
  "origin": { "x": -53, "y": -40.5 },
  "map": "hexagon",
  "mapProps": [4]
}

interface GameLayoutState {
  boardHexagons: Hex[];
  goals: number[];
}

class GameLayout extends Component<{}, GameLayoutState> {
  constructor(props: {}) {
    super(props);
    const goals = [ "goal1", "goal2", "goal3", "goal4", "goal5", "goal6" ];
    const selectedGoalIds = getDistinctRandomNumbers(3, 0, 5);

    const boardHexagons = [
      { q: 0, r: 0, s: 0, },
      { q: 1, r: 0, s: -1, },
      { q: 2, r: 0, s: -2, },
      { q: 3, r: 0, s: -3, },
      { q: 4, r: 0, s: -4, },
      
      { q: -1, r: 1, s: 0, },
      { q: 0, r: 1, s: 0, },
      { q: 1, r: 1, s: 0, image: goals[selectedGoalIds[0]] },
      { q: 2, r: 1, s: -3, },
      { q: 3, r: 1, s: -4, },
      
      { q: -1, r: 2, s: 0, },
      { q: 0, r: 2, s: -1, },
      { q: 1, r: 2, s: -2, },
      { q: 2, r: 2, s: -3, image: goals[selectedGoalIds[1]] },
      { q: 3, r: 2, s: -4, },
      
      { q: -2, r: 3, s: 0, },
      { q: -1, r: 3, s: -1, image: goals[selectedGoalIds[2]] },
      { q: 0, r: 3, s: -2, },
      { q: 1, r: 3, s: -3, },
      { q: 2, r: 3, s: -4, },
      
      { q: -2, r: 4, s: 0, },
      { q: -1, r: 4, s: -1, },
      { q: 0, r: 4, s: -2, },
      { q: 1, r: 4, s: -3, },
      { q: 2, r: 4, s: -4, },
    ];
    this.state = { boardHexagons: boardHexagons, goals: selectedGoalIds };
  }

  // onDrop you can read information of the hexagon that initiated the drag
  onDrop(event: React.DragEvent,
    source: { data?: any; state: any; props?: HexagonProps; },
    targetProps: any ) {
    const { boardHexagons: hexagons } = this.state;
    targetProps = targetProps as HexagonProps;
    const hexas = hexagons.map(hex => {
      // When hexagon is dropped on this hexagon, copy it's image and text
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.image = targetProps.data.image;
        hex.text = targetProps.data.text;
      }
      return hex;
    });
    this.setState({ boardHexagons: hexas });
  }

  onDragStart(event: { preventDefault: () => void; }, source: { props: { data: { text: any; }; }; }) {
    // If this tile is empty, let's disallow drag
    if (!source.props.data.text) {
      event.preventDefault();
    }
  }

  // Decide here if you want to allow drop to this node
  onDragOver(event: React.DragEvent<Element>, source: { data?: any; state: any; props: any; }) {
    // Find blocked hexagons by their 'blocked' attribute
    const blockedHexas = this.state.boardHexagons.filter(h => h.blocked);
    // Find if this hexagon is listed in blocked ones
    const blocked = blockedHexas.find(blockedHex => {
      return HexUtils.equals(source.state.hex, blockedHex);
    });

    const { text } = source.props.data;
    // Allow drop, if not blocked and there's no content already
    if (!blocked && !text) {
      // Call preventDefault if you want to allow drop
      event.preventDefault();
    }
  }

  // onDragEnd you can do some logic, e.g. to clean up hexagon if drop was success
  onDragEnd(event: any, source: { state: { hex: HexCoordinates; }; }, success: any) {
    if (!success) {
      return;
    }
    // TODO Drop the whole hex from array, currently somethings wrong with the patterns

    const { boardHexagons: hexagons } = this.state;
    // When hexagon is successfully dropped, empty it's text and image
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.text = undefined;
        hex.image = undefined;
      }
      return hex;
    });
    this.setState({ boardHexagons: hexas });
  }

  render() {
    const { boardHexagons: hexagons } = this.state;
    const size = { x: config.layout.width, y: config.layout.height };
    const innerSize = { x: config.layout.width-.75, y: config.layout.height };
    return (
      // note: key must be unique between re-renders.
      // using config.mapProps+i makes a new key when the goal template changes.
      <React.Fragment>
        <Layout size={size} flat={false} spacing={1.02} origin={config.origin}>
        {
          hexagons.map((hex, i) => (
            <Hexagon
              key={ i }
              q={ hex.q }
              r={ hex.r }
              s={ hex.s }
              fill={ hex.image != null ? hex.image : undefined }
              onDragOver={ (e, h) => this.onDragOver(e, h) }
              onDrop={ (e, h, t) => this.onDrop(e, h, t) }
             >
            </Hexagon>
          ))
        }
        </Layout>
        <Pattern id="goal1" size={innerSize} link={goal1} />
        <Pattern id="goal2" size={innerSize} link={goal2} />
        <Pattern id="goal3" size={innerSize} link={goal3} />
        <Pattern id="goal4" size={innerSize} link={goal4} />
        <Pattern id="goal5" size={innerSize} link={goal5} />
        <Pattern id="goal6" size={innerSize} link={goal6} />
      </React.Fragment>
    );
  }
}

export default GameLayout;
