import React from 'react';
import T from 'i18n-react';
import {compose} from 'recompose';
import {connect} from 'react-redux';


import {Redirect} from 'react-router';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

import TextLogin from "./auth/TextLogin";
import VKAPILogin from './auth/VKAPILogin';
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    loginOption: {
        padding: theme.spacing.unit * 3
        , margin: theme.spacing.unit
        , flexGrow: 1
        , height: 'calc(100% - ' + theme.spacing.unit * 2 + 'px)'
        , width: 'calc(100% - ' + theme.spacing.unit * 2 + 'px)'
        , display: "flex"
        , flexDirection: "column"
        , alignItems: "center"
        , justifyContent: "center"
    }
    , root: {
        maxWidth: 1024
    }
});


export const Login = ({classes, isAuthenticated}) => { //TODO i18n to FAQ
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
                        <Typography>
                            <br/>
                            Игра скопирована с настольной игры "Эволюция: Происхождение Видов"
                            http://rightgames.ru/games/evolyuciya
                            <br/>
                            <br/>
                            Адрес оф. сервера: https://evo2.herokuapp.com
                            <br/>
                            <br/>
                            Адрес неоф. сервера: https://evolution-hevav.herokuapp.com
                            <br/>
                            <br/>
                            Список изменений: https://github.com/ivan-work/evolution-web/blob/master/changelog.md
                            <br/>
                            <br/>
                            Правила: https://vk.com/doc-36567706_134818567
                            <br/>
                            <br/>
                            Правила растений: https://hobbyworld.ru/download/rules/evo-plant_rus.pdf

                        </Typography>
                    </Paper>
                </Grid>
                <Grid container
                      justify="center"
                      alignItems="stretch"
                >
                    {isAuthenticated && <Redirect to={'/'}/>}
                    <Grid item xs={6}>
                        <Paper className={classes.loginOption}>
                            <TextLogin/>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.loginOption}>
                            <VKAPILogin/>
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