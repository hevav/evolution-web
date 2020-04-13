import React from 'react';
import PropTypes from 'prop-types'
import T from 'i18n-react';

import {branch, compose, renderNothing, withProps, withStateHandlers} from "recompose";
import {connect} from 'react-redux';
import {Route, Router, withRouter} from "react-router";
import {TransitEnterexit as ExitIcon, RemoveRedEye as SpectateIcon, PlayCircleFilled as StartIcon, ExitToApp as BackIcon, PlayArrow as PlayIcon} from "@material-ui/icons";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import TimeService from '../../services/TimeService';
import {RoomModel} from '../../../shared/models/RoomModel';

import {redirectTo} from "../../../shared/utils/history";
import {
  roomExitRequest,
  roomStartVotingRequest,
  roomJoinRequest,
  roomSpectateRequest
} from '../../../shared/actions/actions';
import {failsChecks} from '../../../shared/actions/checks';
import {checkCanJoinRoomToPlay} from '../../../shared/actions/rooms.checks';
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  menuItem: {
    outline: 'none'
  }
  , menuItemText: {
    padding: 0
  }
  , menuItemTextPrimary: {
    color: theme.palette.primary.dark
  }
  , barPadding: {paddingLeft: '12px'}
    , noWrap: {
        whiteSpace: "nowrap"
    }
});

export const RoomControlGroupMenu = compose(
  withStyles(styles)
  , withStateHandlers({anchorEl: null}
    , {
      openMenu: () => (e) => ({anchorEl: e.target})
      , closeMenu: () => () => ({anchorEl: null})
    })
  , withProps(({$start, closeMenu}) => ({
    $start: () => {
      $start();
      closeMenu();
    }
    , $back: () => {
      redirectTo('/room');
      closeMenu();
    }
  }))
)(
  ({
     classes, text, showText, anchorEl, openMenu, closeMenu
     , userId, room, inRoom, game
     , $back, $exit, $start, $roomJoin, $roomSpectate
   }) => (
    <>
      <List>
        <Divider/>
        <ListItem className={classes.menuItem}>
          <ListItemText className={classes.noWrap} classes={{root: classes.menuItemText, primary: classes.menuItemTextPrimary}} primary={(showText)? text : "......"}/>
          {/*<Typography className={classes.menuItem}>{text}</Typography>*/}
        </ListItem>

          {!inRoom && <MenuItem onClick={$back}><BackIcon/><span className={classes.barPadding}>{showText && T.translate('App.Room.$Back')}</span></MenuItem>}

        {!game && <MenuItem onClick={$start}
                            disabled={!room.checkCanStart(userId, TimeService.getServerTimestamp())}>
            <StartIcon/>
            <span className={classes.barPadding}>{showText && T.translate('App.Room.$Start')}</span>
        </MenuItem>}

        {!game && !!~room.spectators.indexOf(userId)
        && <MenuItem onClick={$roomJoin}
                     disabled={failsChecks(() => checkCanJoinRoomToPlay(room, userId))}>
            <PlayIcon/>
            <span className={classes.barPadding}>{showText && T.translate('App.Room.$Play')}</span>
        </MenuItem>}

        {!game && !!~room.users.indexOf(userId)
        && <MenuItem onClick={$roomSpectate}>
            <SpectateIcon/>
            <span className={classes.barPadding}>{showText && T.translate('App.Room.$Spectate')}</span>
        </MenuItem>}

        <MenuItem onClick={$exit}>
            <ExitIcon/>
            <span className={classes.barPadding}>{showText && T.translate('App.Room.$Exit')}</span></MenuItem>
      </List>
    </>
  ));

// https://github.com/acdlite/recompose/issues/467
export const RoomControlGroup = (
  ({history, room, showText, ...props}) => (
    <Router history={history}>
      <Route render={({location}) => {
        const inRoom = !!~location.pathname.indexOf('room');
        return (
          <RoomControlGroupMenu showText={showText} text={`${room.name}`} room={room} inRoom={inRoom} {...props}/>
        )
      }}/>
    </Router>
  )
);

RoomControlGroup.propTypes = {
  userId: PropTypes.string.isRequired
  , roomId: PropTypes.string.isRequired
  , room: PropTypes.instanceOf(RoomModel)
  , $exit: PropTypes.func.isRequired
  , $start: PropTypes.func.isRequired
  , $roomJoin: PropTypes.func.isRequired
  , $roomSpectate: PropTypes.func.isRequired
};

export const RoomControlGroupView = compose(
  connect(
    (state) => {
      const roomId = state.get('room');
      return {
        roomId
        , room: state.getIn(['rooms', roomId])
        , game: state.getIn(['game'])
        , userId: state.getIn(['user', 'id'])
      }
    }
    , {roomExitRequest, roomStartVotingRequest, roomJoinRequest, roomSpectateRequest}
  )
  , withProps(({roomId, inRoom, showText, roomExitRequest, roomStartVotingRequest, roomJoinRequest, roomSpectateRequest}) => ({
    $exit: roomExitRequest
    , $start: roomStartVotingRequest
    , $roomJoin: () => roomJoinRequest(roomId)
    , $roomSpectate: () => roomSpectateRequest(roomId)
  }))
  , branch(({room}) => !room, renderNothing)
  , withRouter
)(RoomControlGroup);

export default RoomControlGroupView;