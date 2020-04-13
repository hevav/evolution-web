import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Map, List, fromJS} from 'immutable';
import Button from "@material-ui/core/Button/Button";
import {debugMirrorPlayer} from '../../actions/debug';
import {PersonAdd as MirrorIcon} from "@material-ui/icons";
import MenuItem from "@material-ui/core/MenuItem";

export const GameSection = ({debugMirrorPlayer, showText}) => (
  <div>
      <MenuItem onClick={debugMirrorPlayer}><MirrorIcon/><span style={{paddingLeft: "12px"}}>{showText && "Mirror player"}</span></MenuItem>
  </div>
);

export default connect(
  (state) => {
    const userId = state.getIn(['user', 'id'], '%USERNAME%');
    const roomId = state.get('room');
    const game = state.getIn(['rooms', roomId]);
    return {
      roomId
      , userId
      , game
    }
  }
  , ({debugMirrorPlayer})
)(GameSection);
