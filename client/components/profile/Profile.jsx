import React from "react";
import T from "i18n-react";
import {connect} from 'react-redux';
import {branch, compose, renderNothing} from 'recompose';

import MenuItem from "@material-ui/core/MenuItem";
import {ExitToApp as LeaveIcon} from "@material-ui/icons";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {server$logoutUser} from "../../../shared/actions/auth";

export const LinkBody = ({userId, showText}) =>
      <MenuItem onClick={()=>{(process.env.NODE_ENV === 'production'
          ? localStorage
          : sessionStorage).removeItem('user'); window.location.reload()}}>
            <LeaveIcon/>
          <span style={{paddingLeft: '12px'}}>{showText && T.translate("App.Room.$Exit")}</span>
      </MenuItem>

export default connect((state)=>{return {userId: state.user.id}})(LinkBody)