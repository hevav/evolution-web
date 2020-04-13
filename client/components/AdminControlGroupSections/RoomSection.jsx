import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Map, List, fromJS} from 'immutable';

import {roomSetSeedRequest, roomStartVotingRequest} from '../../../shared/actions/actions';
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";

const defaultGameSeed = `deck: 12 carnivorous, 6 sharp
phase: feeding
food: 2
players:
  - hand: 1 sharp, 1 camo
    continent: carn sharp, carn camo
  - hand: 1 sharp, 1 camo
    continent: carn sharp, carn camo
`;

export class RoomSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameSeed: window.localStorage.getItem('gameSeed') || defaultGameSeed
    }
  }

  setGameSeed(gameSeed) {
    window.localStorage.setItem('gameSeed', gameSeed);
    this.setState({gameSeed})
  }

  render() {
    return (<div style={{maxHeight: "200px"}}>{this.props.showText && <div>
      {this.props.gameCanStart
        ? <MenuItem
                  onClick={this.props.$start(this.props.roomId, this.state.gameSeed)}>
              Start Game
        </MenuItem>
        : null}
      <Input style={{padding: "24px", whiteSpace: "nowrap"}}
        multiline={true}
        value={this.state.gameSeed}
        onChange={(e) => this.setGameSeed(e.target.value)}/>
    </div>}</div>)
  }
}

export default connect(
  (state) => {
    const userId = state.getIn(['user', 'id'], '%USERNAME%');
    const roomId = state.get('room');
    const room = state.getIn(['rooms', roomId]);
    const gameCanStart = room ? room.checkCanStart(userId) : false;
    return {
      roomId
      , userId
      , gameCanStart
    }
  }
  , (dispatch) => ({
    $start: (roomId, seed) => () => {
      dispatch(roomSetSeedRequest(seed));
      dispatch(roomStartVotingRequest());
    }
  })
)(RoomSection);
