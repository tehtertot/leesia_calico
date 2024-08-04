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
import { HexagonProps } from 'react-hexgrid/lib/Hexagon/Hexagon';
import darkBlue1 from './calico tiles/tiles/darkBlue/1.png';
import darkBlue2 from './calico tiles/tiles/darkBlue/2.png';
import darkBlue3 from './calico tiles/tiles/darkBlue/3.png';
import darkBlue4 from './calico tiles/tiles/darkBlue/4.png';
import darkBlue5 from './calico tiles/tiles/darkBlue/5.png';
import darkBlue6 from './calico tiles/tiles/darkBlue/6.png';
import green1 from './calico tiles/tiles/green/1.png';
import green2 from './calico tiles/tiles/green/2.png';
import green3 from './calico tiles/tiles/green/3.png';
import green4 from './calico tiles/tiles/green/4.png';
import green5 from './calico tiles/tiles/green/5.png';
import green6 from './calico tiles/tiles/green/6.png';
import lightBlue1 from './calico tiles/tiles/lightBlue/1.png';
import lightBlue2 from './calico tiles/tiles/lightBlue/2.png';
import lightBlue3 from './calico tiles/tiles/lightBlue/3.png';
import lightBlue4 from './calico tiles/tiles/lightBlue/4.png';
import lightBlue5 from './calico tiles/tiles/lightBlue/5.png';
import lightBlue6 from './calico tiles/tiles/lightBlue/6.png';
import pink1 from './calico tiles/tiles/pink/1.png';
import pink2 from './calico tiles/tiles/pink/2.png';
import pink3 from './calico tiles/tiles/pink/3.png';
import pink4 from './calico tiles/tiles/pink/4.png';
import pink5 from './calico tiles/tiles/pink/5.png';
import pink6 from './calico tiles/tiles/pink/6.png';
import purple1 from './calico tiles/tiles/purple/1.png';
import purple2 from './calico tiles/tiles/purple/2.png';
import purple3 from './calico tiles/tiles/purple/3.png';
import purple4 from './calico tiles/tiles/purple/4.png';
import purple5 from './calico tiles/tiles/purple/5.png';
import purple6 from './calico tiles/tiles/purple/6.png';
import yellow1 from './calico tiles/tiles/yellow/1.png';
import yellow2 from './calico tiles/tiles/yellow/2.png';
import yellow3 from './calico tiles/tiles/yellow/3.png';
import yellow4 from './calico tiles/tiles/yellow/4.png';
import yellow5 from './calico tiles/tiles/yellow/5.png';
import yellow6 from './calico tiles/tiles/yellow/6.png';
import { GameContext, GameContextProps } from './GameContext';

const config = {
  "width": 1000,
  "height": 800,
  "layout": { "width": 7.1, "height": 7.1, "flat": true, "spacing": 1.2 },
  "origin": { "x": -53, "y": -40.5 },
  "map": "hexagon",
  "mapProps": [4]
}

class GameLayout extends Component<{}, GameContextProps> {
  static contextType = GameContext;
  context!: React.ContextType<typeof GameContext>;

  // check whether the spot is available for tile placement
  onDragOver(event: any, source: any) {
    if (!source.props.fill) {
      event.preventDefault();
    }
  }
  
  // onDrop you can read information of the hexagon that initiated the drag
  onDrop(event: any, source: any, targetProps: any) {
    console.log("on drop")
    console.log(source);
    console.log(targetProps)
    const { state, updateBoard } = this.context;
    const hexas = state.boardHexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.image = "x-" + targetProps.fill;
      }
      return hex;
    });

    updateBoard(hexas);
  }

  render() {
    const { state } = this.context as GameContextProps;
    
    const size = { x: config.layout.width, y: config.layout.height };
    const innerSize = { x: config.layout.width-.75, y: config.layout.height };
    return (
      // note: key must be unique between re-renders.
      // using config.mapProps+i makes a new key when the goal template changes.
      <React.Fragment>
        <Layout size={size} flat={false} spacing={1.02} origin={config.origin}>
        {
          state.boardHexagons.map((hex, i) => (
            <Hexagon
              key={ i }
              q={ hex.q }
              r={ hex.r }
              s={ hex.s }
              data={ hex }
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

        <Pattern id="x-darkBlue1" size={innerSize} link={darkBlue1} />
        <Pattern id="x-darkBlue2" size={innerSize} link={darkBlue2} />
        <Pattern id="x-darkBlue3" size={innerSize} link={darkBlue3} />
        <Pattern id="x-darkBlue4" size={innerSize} link={darkBlue4} />
        <Pattern id="x-darkBlue5" size={innerSize} link={darkBlue5} />
        <Pattern id="x-darkBlue6" size={innerSize} link={darkBlue6} />
        <Pattern id="x-green1" size={innerSize} link={green1} />
        <Pattern id="x-green2" size={innerSize} link={green2} />
        <Pattern id="x-green3" size={innerSize} link={green3} />
        <Pattern id="x-green4" size={innerSize} link={green4} />
        <Pattern id="x-green5" size={innerSize} link={green5} />
        <Pattern id="x-green6" size={innerSize} link={green6} />
        <Pattern id="x-lightBlue1" size={innerSize} link={lightBlue1} />
        <Pattern id="x-lightBlue2" size={innerSize} link={lightBlue2} />
        <Pattern id="x-lightBlue3" size={innerSize} link={lightBlue3} />
        <Pattern id="x-lightBlue4" size={innerSize} link={lightBlue4} />
        <Pattern id="x-lightBlue5" size={innerSize} link={lightBlue5} />
        <Pattern id="x-lightBlue6" size={innerSize} link={lightBlue6} />
        <Pattern id="x-pink1" size={innerSize} link={pink1} />
        <Pattern id="x-pink2" size={innerSize} link={pink2} />
        <Pattern id="x-pink3" size={innerSize} link={pink3} />
        <Pattern id="x-pink4" size={innerSize} link={pink4} />
        <Pattern id="x-pink5" size={innerSize} link={pink5} />
        <Pattern id="x-pink6" size={innerSize} link={pink6} />
        <Pattern id="x-purple1" size={innerSize} link={purple1} />
        <Pattern id="x-purple2" size={innerSize} link={purple2} />
        <Pattern id="x-purple3" size={innerSize} link={purple3} />
        <Pattern id="x-purple4" size={innerSize} link={purple4} />
        <Pattern id="x-purple5" size={innerSize} link={purple5} />
        <Pattern id="x-purple6" size={innerSize} link={purple6} />
        <Pattern id="x-yellow1" size={innerSize} link={yellow1} />
        <Pattern id="x-yellow2" size={innerSize} link={yellow2} />
        <Pattern id="x-yellow3" size={innerSize} link={yellow3} />
        <Pattern id="x-yellow4" size={innerSize} link={yellow4} />
        <Pattern id="x-yellow5" size={innerSize} link={yellow5} />
        <Pattern id="x-yellow6" size={innerSize} link={yellow6} />
      </React.Fragment>
    );
  }
}

export default GameLayout;
