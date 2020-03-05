import React, {Component} from 'react';
// import {connect} from 'react-redux';
import T from 'i18n-react';
import Button from '@material-ui/core/Button';
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  }
});

export const TwitterAPILogin = ({classes}) => {
  return (
    <div id="TwitterAPIAuth" className={classes.root}>
      <Button color="primary" variant="contained" disabled>{T.translate('App.Login.Twitter')}</Button>
    </div>
  );
};

export default withStyles(styles)(TwitterAPILogin);