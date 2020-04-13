import React, {Fragment} from 'react';
import T from 'i18n-react';
import {compose} from 'recompose';
import {connect} from 'react-redux';


import {Redirect} from 'react-router';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";

import TextLogin from "./auth/TextLogin";
import VKAPILogin from './auth/VKAPILogin';
import TwitterAPILogin from './auth/TwitterAPILogin';
import Typography from "@material-ui/core/Typography";
import TopList from "./players/TopList";
import IgnoreUnignoreTooltip from "../components/IgnoreUnignoreTooltip";
import OnlineWidget from "./players/OnlineWidget";

const styles = theme => ({
  loginOption: {
    padding: theme.spacing(3)
    , margin: theme.spacing()
        , flexGrow: 1
        , height: 'calc(100% - ' + theme.spacing(2) + 'px)'
        , width: 'calc(100% - ' + theme.spacing(2) + 'px)'
        , display: "flex"
        , flexDirection: "column"
        , alignItems: "center"
        , justifyContent: "center"
    }
    , root: {
        maxWidth: 1024
    }
});

export const Login = ({classes, isAuthenticated}) => {
    return (
        <Grid container
              direction="column"
              alignItems="center">
            <Grid container
                  direction="row"
                  justify="center"
                  className={classes.root}
            >
                <Grid item xs={12}>
                    <Paper className={classes.loginOption}>
                        <Typography variant="h3">
                            {T.translate("App.Name")}
                        </Typography>
                        <Typography variant="h6">
                            {T.translate("App.Misc.FAQ")}
                        </Typography>
                        <Typography dangerouslySetInnerHTML={{ __html: T.translate("App.Misc.FAQ_TEXT") }}/>
                    </Paper>
                </Grid>
                <Grid container
                      justify="center"
                      alignItems="stretch"
                >
                    {isAuthenticated && <Redirect to={'/'}/>}
                    <Grid item xs={12} md={4}>
                        <Paper className={classes.loginOption}>
                            <Typography variant="h4">
                                {T.translate("App.Top.Top")}
                            </Typography>
                            <TopList/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper className={classes.loginOption}>
                            <Typography variant="h4">
                                {T.translate('App.Online')}
                            </Typography>
                            <OnlineWidget/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper className={classes.loginOption}>
                            <Typography variant="h4">
                                {T.translate("App.Login.Login")}
                            </Typography>
                            <TextLogin/>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default compose(
    withStyles(styles)
    , connect(
        (state) => ({
            isAuthenticated: !!state.user
        })
    )
)(Login);