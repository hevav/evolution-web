import React from 'react';
import PropTypes from 'prop-types';

import {GameModelClient} from '../../../../shared/models/game/GameModel';
import withStyles from "@material-ui/core/styles/withStyles";
import PlayerUser from "./PlayerUser";
import {connect} from "react-redux";
import {List} from "immutable";
import User from "../../players/User";
import SpectatorIcon from '@material-ui/icons/RemoveRedEye';
import Grid from "@material-ui/core/Grid";

const withSpectators = connect((state) => {
  const roomId = state.get('room');
  return {
    spectators: state.getIn(['rooms', roomId, 'spectators'], List())
  }
});

const styles = theme => ({
  PlayersList: {}
});

export const PlayersList = withStyles(styles)(({classes, game, spectators}) => (
  <div className={classes.PlayersList}>
    {game.sortPlayersFromIndex(game.players).map(player => <PlayerUser key={player.id} game={game} playerId={player.id}/>)}
    {spectators && spectators.size > 0 && spectators.map(userId =>
        <span key={userId}>
            <User id={userId}/>
            &nbsp;
            (<SpectatorIcon color="secondary" style={{fontSize: "0.875rem"}}/>)
        </span>
    )}
  </div>
));

PlayersList.propTypes = {
  game: PropTypes.instanceOf(GameModelClient).isRequired
};

export default withSpectators(PlayersList);