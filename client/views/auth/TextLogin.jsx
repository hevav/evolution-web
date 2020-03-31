import React from "react";
import T from "i18n-react";

import {compose, withStateHandlers} from "recompose";
import {connect} from "react-redux";

import Button from "@material-ui/core/Button/Button";
import EvoTextField from "../../components/EvoTextField";

import withForm from "../../components/withForm";
import {RulesLoginPassword} from "../../../shared/models/UserModel";

import {loginUserFormRequest} from "../../../shared/actions/auth";
import VKAPILogin from "./VKAPILogin";
import TwitterAPILogin from "./TwitterAPILogin";
import Paper from "@material-ui/core/Paper";

function buttonChanging(isGuest) {
    if(isGuest)
        document.getElementById("Submit").innerText=T.translate("App.Login.Guest");
    else
        document.getElementById("Submit").innerText=T.translate("App.Login.Login");
}
export const TextLogin = compose(
    connect(
        null,
        (dispatch) => ({
            $loginUser: (...args) => dispatch(loginUserFormRequest(...args))
        })
    )
    , withForm({
        form: {login: '', password: ''}
        , rules: RulesLoginPassword
        , onSubmit: (form, {$loginUser}) => {
            $loginUser('/', form)
        }
    })
)(
    ({form, errors, formOnChange, formOnSubmit}) => (
        <form noValidate>
            <div>
                <EvoTextField
                    name="login"
                    label={T.translate('App.Login.Username')}
                    value={form.login}
                    onChange={formOnChange}
                    error={errors.login}
                    style={{width: "100%"}}
                />
            </div>
            <div>
                <EvoTextField
                    name="password"
                    type="password"
                    label={T.translate('App.Login.Password')}
                    value={form.password}
                    onChange={(e)=> {formOnChange(e); buttonChanging(e.target.value.length === 0)}}
                    error={errors.password}
                    style={{width: "100%"}}
                />
            </div>
            <Button
                id='Submit'
                type='submit'
                variant="contained"
                color="primary"
                style={{margin: "4px"}}
                onClick={formOnSubmit}
            >{T.translate('App.Login.Guest')}
            </Button>
            <VKAPILogin/>
            <TwitterAPILogin/>
        </form>));

export default TextLogin;