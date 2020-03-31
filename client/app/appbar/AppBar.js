import React from 'react';
import T from 'i18n-react';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import MUIAppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import {withStyles} from '@material-ui/core/styles';

import EvoLink from "../../components/EvoLink";

import AdminControlGroup from '../../components/AdminControlGroup.jsx'
import RoomControlGroup from "../../views/rooms/RoomControlGroup";
import GameScoreboardFinal from "../../views/game/ui/GameScoreboardFinal";
import AppBarMenu from "./AppBarMenu";
import IconMenu from '@material-ui/icons/Menu';
import {SettingVolumeMenuItem} from "./SettingVolume";
import {SettingUIv3MenuItem} from "./SettingUIv3";
import LinkProfile from "../../components/profile/LinkProfile";
import GuardUser from "../../components/GuardUser";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Profile from "../../components/profile/Profile";

const styles = theme => ({
  title: {
    overflow: 'hidden'
    , minWidth: '1em'
  }
  , titleDrawer: {
    margin: '24px'
  }
  , appBarMenu: {
    margin: '5px'
  }
  , drawerItem: {
    paddingLeft: '24px'
  }
  , portal: {
    whiteSpace: 'nowrap'
    // overflowY: 'hidden'
    // , overflowX: 'auto'
  }
  , spacer: {flexGrow: 1}
  , button: {
    whiteSpace: 'nowrap'
    , margin: theme.spacing()
    , flex: theme.style.flex.off
  }
});

export const AppBar = function ({classes}) {
  const [open, setOpen] = React.useState(false);
  return (
  <MUIAppBar>
    <Toolbar>
      <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={()=>setOpen(!open)}>
        <IconMenu/>
      </IconButton>
      <div className={classes.title}>
        <EvoLink to='/' variant="h4" color="inherit">{T.translate('App.Name')}</EvoLink>
      </div>
    </Toolbar>
    <Drawer
        anchor="left"
        open={open}
        onClose={()=>setOpen(false)}>
      <div className={classes.titleDrawer}>
        <EvoLink to='/' variant="h4" color="inherit">
          <Typography variant="h4">{T.translate('App.Name')}</Typography>
        </EvoLink>
        <Typography variant="caption" color="inherit">v{GLOBAL_VERSION}</Typography>
      </div>
      <Divider/>
      <GuardUser>
        <SettingVolumeMenuItem className={classes.drawerItem}/>
        <SettingUIv3MenuItem className={classes.drawerItem}/>
        <LinkProfile className={classes.drawerItem}/>
        <Profile />
        <RoomControlGroup className={classes.drawerItem}/>
        <GameScoreboardFinal className={classes.drawerItem}/>
        <AdminControlGroup className={classes.drawerItem}/>
      </GuardUser>

      <Divider/>

      <span className={classes.spacer}>&nbsp;</span>

      <Button className={classes.button}
              target="blank"
              variant="outlined"
              color="secondary"
              href="https://vk.com/evolveonline">
        {T.translate('App.Misc.VKGroup')}
      </Button>

      <Button className={classes.button}
              target="blank"
              color="inherit"
              href={T.translate('App.Misc.FAQ_HREF')}>
        {T.translate('App.Misc.FAQ')}
      </Button>
    </Drawer>
  </MUIAppBar>
  )};

export default withStyles(styles)(AppBar);