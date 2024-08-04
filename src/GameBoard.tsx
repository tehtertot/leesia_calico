import React, { Component } from 'react';
import { Layout, Hex, Hexagon, HexGrid, HexUtils, Pattern, Text } from 'react-hexgrid';
import './GameBoard.css';
import goal1 from './calico tiles/goals/1.png';
import goal2 from './calico tiles/goals/2.png';
import goal3 from './calico tiles/goals/3.png';
import goal4 from './calico tiles/goals/4.png';
import goal5 from './calico tiles/goals/5.png';
import goal6 from './calico tiles/goals/6.png';
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
import darkBlueButton from './calico tiles/buttons/darkBlue.png';
import darkBlueButtonActive from './calico tiles/buttons/darkBlue-active.png';
import greenButton from './calico tiles/buttons/green.png';
import greenButtonActive from './calico tiles/buttons/green-active.png';
import lightBlueButton from './calico tiles/buttons/lightBlue.png';
import lightBlueButtonActive from './calico tiles/buttons/lightBlue-active.png';
import pinkButton from './calico tiles/buttons/pink.png';
import pinkButtonActive from './calico tiles/buttons/pink-active.png';
import purpleButton from './calico tiles/buttons/purple.png';
import purpleButtonActive from './calico tiles/buttons/purple-active.png';
import yellowButton from './calico tiles/buttons/yellow.png';
import yellowButtonActive from './calico tiles/buttons/yellow-active.png';
import rainbowButton from './calico tiles/buttons/rainbow.png';
import rainbowButtonActive from './calico tiles/buttons/rainbow-active.png';
import { ButtonColor, GameContext, GameContextProps, PlayState } from './GameContext';

const config = {
  "width": 1000,
  "height": 800,
  "layout": { "width": 7.1, "height": 7.1, "flat": true, "spacing": 1.2 },
  "origin": { "x": -53, "y": -40.5 },
  "map": "hexagon",
  "mapProps": [4]
}

type ColorImagesMap = {
  [key: string]: [string, string];
}

const colorImagesMap: ColorImagesMap = {
  "darkBlue": [darkBlueButton, darkBlueButtonActive],
  "green": [greenButton, greenButtonActive],
  "lightBlue": [lightBlueButton, lightBlueButtonActive],
  "pink": [pinkButton, pinkButtonActive],
  "purple": [purpleButton, purpleButtonActive],
  "yellow": [yellowButton, yellowButtonActive],
  "rainbow": [rainbowButton, rainbowButtonActive],
}

class GameLayout extends Component<{}, GameContextProps> {
  static contextType = GameContext;
  context!: React.ContextType<typeof GameContext>;

  // check whether the spot is available for tile placement
  onClick(event: any, source: any) {
    const { state, updateBoardAndPlayerTiles, addButton } = this.context;
    if (!source.props.fill && state.activeTile && state.playState === PlayState.TILE_SELECTED) {
      // fill the spot on the board with the current active tile
      const selectedSpot : Hex | undefined = state.boardHexagons.find(hex => HexUtils.equals(source.state.hex, hex));
      if (selectedSpot) {
        selectedSpot.image = `x-${state.activeTile.color}${state.activeTile.patternId}`;
      }
      state.playerTiles = state.playerTiles.filter(tile => tile.id !== state.activeTile!.id);
      updateBoardAndPlayerTiles(state.boardHexagons, state.playerTiles);
    }
    else if (source.props.fill && state.activeButton && !source.props.fill.startsWith('goal')) {
      const heights = [333, 417, 503, 587, 671];
      const widths = [
        [288, 388, 488, 588, 688],
        [238, 338, 438, 538, 638],
      ];
      const height = heights[source.state.hex.r];
      const widthsIdx = source.state.hex.r % 2 === 0 ? 0 : 1;
      let width = widths[widthsIdx][Math.abs(source.state.hex.s)];
      width = state.activeButton === 'rainbow' ? width - 10 : width + 5;
      addButton(state.activeButton, { x: width, y: height });
    }
  }

  setActiveButton(color: ButtonColor) {
    const { state, setActiveButton } = this.context;
    if (!state.activeTile) {
      const updatedColor = state.activeButton === color ? undefined : color;
      setActiveButton(updatedColor);
    }
  }
  
  render() {
    const { state } = this.context as GameContextProps;
    
    const size = { x: config.layout.width, y: config.layout.height };
    const innerSize = { x: config.layout.width-.75, y: config.layout.height };
    return (
      <div className="game-board">
        <div className="button-area">
          {
            Object.values(ButtonColor).map((color) => (
              <img
                key={color}
                src={state.activeButton === color ? colorImagesMap[color][1] : colorImagesMap[color][0]}
                draggable={false}
                onClick={() => this.setActiveButton(color)}
              />
            ))
          }
        </div>
        <div className="board-area" style={{ backgroundImage: `url(${state.selectedBoard})` }}>
        {state.buttonsPlayed && Object.entries(state.buttonsPlayed).map(([color, positions], index) => (
          positions.map((position, index) => (
            <img
              key={ color + index }
              src={colorImagesMap[color][0]}
              style={{ position: 'absolute', top: position.y, left: position.x, zIndex: 3, height: '4%' }}
              />
            ))
          ))}
          <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
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
                    onClick={ (e, h) => this.onClick(e, h) }
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
          </HexGrid>
        </div>
      </div>
    );
  }
}

export default GameLayout;
