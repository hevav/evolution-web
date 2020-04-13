import React from "react";
import T from "i18n-react";
import {connect} from 'react-redux';
import {branch, compose, renderNothing} from 'recompose';

import {Person as AccountIcon} from "@material-ui/icons"
import MenuItem from "@material-ui/core/MenuItem";
import {Link} from "react-router-dom";

export const LinkBody = ({closeMenu, showText}) => <Link to='/profile' onClick={closeMenu} style={{textDecoration: 'none', color: 'inherit'}}>
  <MenuItem>
    <AccountIcon/>
    <span style={{paddingLeft: '12px'}}>{showText && T.translate('App.Settings.Profile')}</span>
  </MenuItem>
</Link>;

export default compose(
  connect(
    (state, props) => ({authType: state.user.authType})
  )
  , branch(({authType}) => !authType, renderNothing)
)(LinkBody)