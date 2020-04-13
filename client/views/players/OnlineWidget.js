import {connect} from "react-redux";
import React from "react";
import User from "./User";
import List from "@material-ui/core/List";

export default connect((state) => ({
    online: state.online.toList()
}))(({online}) => (
    <List style={{width: "100%"}}>
        {online.map((user, index) =>
            <User id={user.id} variant="withStats"/>
            /*<Fragment key={user.id}>
            {!!index && ', '}
            <IgnoreUnignoreTooltip userId={user.id}><span>{user.login}</span></IgnoreUnignoreTooltip>
        </Fragment>*/)}
    </List>
));