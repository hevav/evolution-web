import React, {Fragment} from 'react';
import T from 'i18n-react';

import {compose} from 'recompose';
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography/Typography";
import IconButton from "@material-ui/core/IconButton";
import IconCreateRoom from "@material-ui/icons/AddCircle";

import RoomsList from '../views/rooms/RoomsList';
import Chat from '../views/Chat.jsx';

import {roomCreateRequest} from '../../shared/actions/actions';
import OnlineWidget from "../views/players/OnlineWidget";
import TopList from "../views/players/TopList";

const styles = theme => ({
  columnPaper: {
    padding: theme.spacing()
    , flex: '1'
    , display: 'flex'
    , flexFlow: 'column nowrap'
    , alignItems: "center"
    , justifyContent: "center"
  }
  , columnTitle: {
    whiteSpace: 'nowrap'
  }
  , roomsListWrapper: {
    flex: '1 1 0'
    , overflowY: 'auto'
    , width: '100%'
  }
  , topGridListWrapper: {
    overflowY: 'auto'
    , width: '100%'
    , maxHeight: '240px'
  },
  root: {
    flex: '1'
  },
  topGrid: {
    height: "100%"
    , padding: theme.spacing()
    , display: 'flex'
    , flexDirection: 'column'
    , alignItems: "center"
  }
  , rightBar: {
    flex: '1'
    , maxWidth: "unset"
  }
});

export const RouteMain = ({classes}) => (
  <Grid className='flex' direction='column' container spacing={1}>
    <Grid direction={(innerWidth < 1000)?"column":"row"} item container spacing={1}>
      <Grid item xs={12} md={4} className={classes.root}>
        <Paper className={classes.topGrid}>
          <Typography variant="h4">{T.translate('App.Tournaments')}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} className={classes.root}>
        <Paper className={classes.topGrid}>
          <Typography variant="h4">{T.translate('App.Online')}</Typography>
          <OnlineWidget className={classes.topGridListWrapper}/>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} className={classes.root}>
        <Paper className={classes.topGrid}>
          <Typography variant="h4">{T.translate('App.Top.Top')}</Typography>
          <TopList className={classes.topGridListWrapper}/>
        </Paper>
      </Grid>
    </Grid>
    <Grid className={classes.root} direction={(innerWidth < 1000)?"":"row"} item container spacing={1}>
      <Grid xs={12} md={8} container item>
        <Paper className={classes.columnPaper}>
          <Typography
              className={classes.columnTitle}
              variant="h4">
            {T.translate('App.Rooms.News')}
          </Typography>
        </Paper>
      </Grid>
      <Grid className={classes.rightBar} direction="column" item container spacing={1} xs={12} md={4}>
        <Grid xs container item>
          <Paper className={classes.columnPaper}>
            <Typography
                className={classes.columnTitle}
                variant="h4">
              {T.translate('App.Rooms.Rooms')}
            </Typography>
            <div className={classes.roomsListWrapper}>
              <RoomsList />
            </div>
          </Paper>
        </Grid>
        <Grid xs container item>
          <Paper className={classes.columnPaper}>
            <Chat chatTargetType='GLOBAL' />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

export default compose(
  withStyles(styles)
)(RouteMain);
