import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Map, List, fromJS} from 'immutable';
import Button from "@material-ui/core/Button/Button";
import {debugMirrorPlayer} from '../../actions/debug';
import MenuItem from "@material-ui/core/MenuItem";

export const GameSection = ({debugMirrorPlayer}) => (
  <div>
    <MenuItem onClick={debugMirrorPlayer}>Mirror player</MenuItem>
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
