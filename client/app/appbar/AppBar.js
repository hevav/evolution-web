import React from 'react';
import T from 'i18n-react';

import MUIAppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import IconMenu from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import {withStyles} from '@material-ui/core/styles';

import EvoLink from "../../components/EvoLink";

import AppBarMenu from "./AppBarMenu";

import AdminControlGroup from '../../components/AdminControlGroup.jsx'
import LinkProfile from "../../components/profile/LinkProfile";
import GuardUser from "../../components/GuardUser";

import RoomControlGroup from "../../views/rooms/RoomControlGroup";
import GameScoreboardFinal from "../../views/game/ui/GameScoreboardFinal";

import {SettingVolumeMenuItem} from "./SettingVolume";
import LinkProfile from "../../components/profile/LinkProfile";
import GuardUser from "../../components/GuardUser";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Profile from "../../components/profile/Profile";
import List from "@material-ui/core/List";
import gecko from "../../assets/gfx/gecko-080.svg";
import clsx from "clsx";
import MenuItem from "@material-ui/core/MenuItem";
import SettingUnignoreAll from "./SettingUnignoreAll";

const styles = theme => ({
  title: {
    overflow: 'hidden'
    , minWidth: '1em'
  }
  , titleDrawer: {
    marginTop: '12px',
    whiteSpace: "nowrap"
  }
  , drawer: {
    overflow: "hidden",
    flexShrink: 0,
    width: "60px"
  }
  , drawerOpened: {
    width: "240px",
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }
  , drawerClosed: {
    width: "59px",
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }
  , noWrap: {
    whiteSpace: "nowrap"
  }
  , appBarMenu: {
    margin: '5px'
  }
  , drawerItemText: {
    paddingLeft: '12px'
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
  let showText = true;
  let setText = ()=>{};
  if(innerWidth > 1000)
    [showText, setText] = React.useState(false);
  return ([
  <MUIAppBar key={0} position="fixed" style={{display: (innerWidth > 1000)?"none":"inherit"}}>
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
  </MUIAppBar>,
  <Drawer
      key={2}
      anchor="left"
      open={open}
      variant={(innerWidth > 1000) && "permanent"}
      edge="start"
      onClose={()=>setOpen(false)}
      //onClick={()=>setText(!showText)}
      onMouseEnter={()=>setText(true)}
      onMouseLeave={()=>setText(false)}
      className={classes.drawer}
      classes={{"paper": clsx(classes.drawer, {
          [classes.drawerClosed]: !showText,
          [classes.drawerOpened]: showText
        })}}
  >
    <MenuItem>
      <EvoLink to='/' color="inherit" className={classes.titleDrawer}>
        <img src={gecko} style={{height: "26px"}}/>
        {
          showText && <span className={classes.drawerItemText}>{T.translate('App.Name')} Online</span>
        }
      </EvoLink>
    </MenuItem>
    <List>
      <Divider/>
      <GuardUser>
        <SettingVolumeMenuItem showText={showText}/>
        <LinkProfile showText={showText}/>
        <Profile showText={showText}/>
          <SettingUnignoreAll />
        <RoomControlGroup showText={showText}/>
        <GameScoreboardFinal showText={showText}/>
        <AdminControlGroup showText={showText}/>
      </GuardUser>
      <Divider/>
    </List>

    <span className={classes.spacer}>&nbsp;</span>

    { showText && <Button className={classes.button}
            target="blank"
            variant="outlined"
            color="secondary"
            href="https://vk.com/evolveonline">
      {T.translate('App.Misc.VKGroup')}
    </Button> }

    { showText && <Button className={classes.button}
            target="blank"
            color="inherit"
            href={T.translate('App.Misc.FAQ_HREF')}>
      {T.translate('App.Misc.FAQ')}
    </Button>
    }
    {showText &&
    <Typography variant="caption" color="inherit" className={classes.noWrap}>
      Evolution-web v{GLOBAL_VERSION}
    </Typography>}
  </Drawer>]
  )};

export default withStyles(styles)(AppBar);