import React from 'react';
import T from 'i18n-react';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {Router} from "react-router";
import routes from "../routes/index";

import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from '@material-ui/core/styles';

import AppBar from './appbar/AppBar';
import {PortalsContext, PortalTarget} from '../views/utils/PortalTarget.jsx'
import {TranslationSwitchView} from '../components/TranslationSwitch.jsx'
import ErrorReporter from '../components/ErrorReporter.jsx';
import AppModal from "./modals/AppModal";
import geckoHR from '../assets/gfx/geckoHR-opacity.svg';
import clsx from "clsx";

const styles = theme => ({
  root: {
    display: 'flex'
    , minHeight: '100%'
    , backgroundColor: "#eef5ee"
    , backgroundImage: "url('"+geckoHR+"')"
    , backgroundRepeat: "no-repeat"
    , backgroundPosition: "center center"
    , backgroundSize: "contain"
    , backgroundAttachment: "fixed"
  }
  , appBarSpacer: (innerWidth > 1000)? {}: theme.mixins.toolbar
  , contentWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: "100%"
    }
  , content: {
    flexGrow: 1
    , padding: theme.spacing(1)
    //, marginLeft: (innerWidth > 1000)? "240px": "inherit"
    , display: 'flex'
    , flexDirection: 'column'
  }
  , limit: {
        maxWidth: "1000px"
    }
});

export const App = ({classes, game}) => {
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar />
      <ErrorReporter />
      <AppModal />
      <div className={classes.contentWrapper}>
          <div className={clsx(classes.content, {[classes.limit]: !game})}>
              <div className={classes.appBarSpacer}/>
            {routes}
          </div>
      </div>
      <svg width="100%" height="100%"
           style={{position: 'absolute', left: '0', top: '0', zIndex: 100, pointerEvents: 'none'}}>
        <PortalTarget name='game-svg' container='g' />
      </svg>
      <div width="100%" height="100%"
           style={{position: 'absolute', left: '0', top: '0', zIndex: 100, pointerEvents: 'none'}}>
        <PortalTarget name='tooltips' />
      </div>
    </div>
  );
}

export const AppView = compose(
    connect(
        (state) => {
            const game = state.get('game');
            return {game}
        }
    )
  , PortalsContext
  , withStyles(styles)
)(App);

export default AppView;