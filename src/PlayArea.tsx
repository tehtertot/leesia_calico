import './SetupArea.css';
import React, { Component, startTransition } from 'react';
import { Layout, Hexagon, HexUtils, Pattern, Hex } from 'react-hexgrid';
import { getDistinctRandomNumbers } from './helperMethods';
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
import { Tile } from './Tile';
import { GameContext, GameContextProps } from './GameContext';

const config = {
  "layout": { "width": 45, "height": 45, "spacing": 1 },
  "origin": { "x": -510, "y": -60 },
}

const idToPattern = ["", "dots", "ferns", "flowers", "clovers", "stripes", "swirls"];

class SetupArea extends Component {
  static contextType = GameContext;
  context!: React.ContextType<typeof GameContext>;

  onDrop(event: any,
    source: any,
    targetProps: any ) {
      console.log('play area on drop')
    // const { boardHexagons: hexagons } = this.state;
    // targetProps = targetProps as HexagonProps;
    // const hexas = hexagons.map(hex => {
    //   // When hexagon is dropped on this hexagon, copy it's image and text
    //   if (HexUtils.equals(source.state.hex, hex)) {
    //     hex.image = targetProps.data.image;
    //     hex.text = targetProps.data.text;
    //   }
    //   return hex;
    // });
    // this.setState({ boardHexagons: hexas });
  }
  
  onDragStart(
    event: any,
    source: any) {
      console.log("play area on drag start")
      console.log(source)
  }

  onDragEnd(event: any,
    source: any,
    success: any) {
    console.log("game board on drag end")
    if (!success) {
      return;
    }
  }

  getTileImageId(tile: Tile): string {
    return tile.color + tile.patternId;
  }

  render() {
    const size = { x: config.layout.width, y: config.layout.height };
    const spacing = config.layout.spacing;
    const innerSize = { x: config.layout.width-.75, y: config.layout.height };
    const { state } = this.context as GameContextProps;
    return (
      <Layout size={size} flat={false} spacing={spacing} origin={config.origin}>
        <Hexagon
          key={state.playerTiles[0].id}
          q={0}
          r={1}
          s={2}
          fill={this.getTileImageId(state.playerTiles[0])}
          onDrop={ (e, h, t) => this.onDrop(e, h, t) }
          onDragStart={ (e, h) => this.onDragStart(e, h) }
          onDragEnd={ (e, h, t) => this.onDragEnd(e, h, t) }
          />
        <Hexagon
          key={state.playerTiles[1].id}
          q={1} r={1} s={2} fill={this.getTileImageId(state.playerTiles[1])} onDragStart={(e, h) => this.onDragStart(e, h) } />
        <Pattern id="darkBlue1" size={innerSize} link={darkBlue1} />
        <Pattern id="darkBlue2" size={innerSize} link={darkBlue2} />
        <Pattern id="darkBlue3" size={innerSize} link={darkBlue3} />
        <Pattern id="darkBlue4" size={innerSize} link={darkBlue4} />
        <Pattern id="darkBlue5" size={innerSize} link={darkBlue5} />
        <Pattern id="darkBlue6" size={innerSize} link={darkBlue6} />
        <Pattern id="green1" size={innerSize} link={green1} />
        <Pattern id="green2" size={innerSize} link={green2} />
        <Pattern id="green3" size={innerSize} link={green3} />
        <Pattern id="green4" size={innerSize} link={green4} />
        <Pattern id="green5" size={innerSize} link={green5} />
        <Pattern id="green6" size={innerSize} link={green6} />
        <Pattern id="lightBlue1" size={innerSize} link={lightBlue1} />
        <Pattern id="lightBlue2" size={innerSize} link={lightBlue2} />
        <Pattern id="lightBlue3" size={innerSize} link={lightBlue3} />
        <Pattern id="lightBlue4" size={innerSize} link={lightBlue4} />
        <Pattern id="lightBlue5" size={innerSize} link={lightBlue5} />
        <Pattern id="lightBlue6" size={innerSize} link={lightBlue6} />
        <Pattern id="pink1" size={innerSize} link={pink1} />
        <Pattern id="pink2" size={innerSize} link={pink2} />
        <Pattern id="pink3" size={innerSize} link={pink3} />
        <Pattern id="pink4" size={innerSize} link={pink4} />
        <Pattern id="pink5" size={innerSize} link={pink5} />
        <Pattern id="pink6" size={innerSize} link={pink6} />
        <Pattern id="purple1" size={innerSize} link={purple1} />
        <Pattern id="purple2" size={innerSize} link={purple2} />
        <Pattern id="purple3" size={innerSize} link={purple3} />
        <Pattern id="purple4" size={innerSize} link={purple4} />
        <Pattern id="purple5" size={innerSize} link={purple5} />
        <Pattern id="purple6" size={innerSize} link={purple6} />
        <Pattern id="yellow1" size={innerSize} link={yellow1} />
        <Pattern id="yellow2" size={innerSize} link={yellow2} />
        <Pattern id="yellow3" size={innerSize} link={yellow3} />
        <Pattern id="yellow4" size={innerSize} link={yellow4} />
        <Pattern id="yellow5" size={innerSize} link={yellow5} />
        <Pattern id="yellow6" size={innerSize} link={yellow6} />
      </Layout>
    );
  }
}

export default SetupArea;
