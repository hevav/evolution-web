import React, {Component} from 'react';
// import {connect} from 'react-redux';
import T from 'i18n-react';
import Button from '@material-ui/core/Button';
import {withStyles} from "@material-ui/core/styles";
import VKIcon from "../../assets/gfx/vk.svg";

const styles = theme => ({
  root: {
    padding: theme.spacing(),
    margin: theme.spacing()/2
  }
});

export const VKAPILogin = ({classes}) => {
  const VK_API_REQUEST = {
    client_id: process.env.VK_API_ID
    , redirect_uri: window.location.origin + '/api/oauth/vk'
    , display: 'page'
    , response_type: 'code'
    , v: '5.60'
    // , revoke: process.env.NODE_ENV === 'pproduction' ? 0 : 1
    // , state: connectionId
  };

  const VK_API_REQUEST_STRING = 'https://oauth.vk.com/authorize?' + Object.keys(VK_API_REQUEST).map((k) => k + '=' + VK_API_REQUEST[k]).join('&');

  return (
    <Button className={classes.root} color="primary" variant="contained" href={VK_API_REQUEST_STRING}><img src={VKIcon} style={{verticalAlign: 'middle', height: "0.875rem", filter: "invert(100%)"}}/></Button>
  );
};

export default withStyles(styles)(VKAPILogin);