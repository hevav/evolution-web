import React from "react";
import T from "i18n-react";
import {connect} from 'react-redux';
import {branch, compose, renderNothing} from 'recompose';

import MenuItem from "@material-ui/core/MenuItem";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {server$logoutUser} from "../../../shared/actions/auth";

export const LinkBody = ({userId}) =>
      <MenuItem onClick={()=>{(process.env.NODE_ENV === 'production'
          ? localStorage
          : sessionStorage).removeItem('user'); window.location.reload()}}>
          {T.translate("App.Room.$Exit")}
      </MenuItem>

export default connect((state)=>{return {userId: state.user.id}})(LinkBody)