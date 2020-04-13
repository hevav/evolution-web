import React, {Component} from 'react';
// import {connect} from 'react-redux';
import T from 'i18n-react';
import Button from '@material-ui/core/Button';
import {withStyles} from "@material-ui/core/styles";
import TwitterIcon from '@material-ui/icons/Twitter';
import AccountBoxIcon from "@material-ui/icons/AccountBox";

const styles = theme => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(0.5)
  }
});

export const TwitterAPILogin = ({classes}) => {
  return (
    <Button className={classes.root} color="primary" variant="contained" disabled><TwitterIcon style={{verticalAlign: 'middle', fontSize: "18px", height: "14px"}}/></Button>
  );
};

export default withStyles(styles)(TwitterAPILogin);