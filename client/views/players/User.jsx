import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import T from "i18n-react";

import IconButton from "@material-ui/core/IconButton";
import IconKickUser from '@material-ui/icons/Clear';
import IconBanUser from '@material-ui/icons/Block';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import VKIcon from '../../assets/gfx/vk.svg';

import Typography from "@material-ui/core/Typography";
import {SvgIcon} from "@material-ui/core";
import {Link} from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";

const defaultUser = (id) => ({
  id, login: '---'
});

export const UserVariants = {
  simple: ({user}) =>
      <span className='User'>
    { (user.authType === "Form") ? <AccountBoxIcon style={{verticalAlign: 'middle', fontSize: "18px", height: "14px", margin: "2px"}}/> : (user.authType === "VK")? <img src={VKIcon} style={{verticalAlign: 'middle', height: "14px", margin: "2px"}}/> : ""}
    {user.login}
      </span>
  , typography: ({user, className}) => (
    <Typography display='inline'
                className={'User' + (className ? ' ' + className : '')}
                color='inherit'
                component='span'>
      {user.login}
    </Typography>
  )
  , listItem: ({user, actions}) => (
    <ListItem key={user.id} className='User' style={{width: 'auto'}}>
      <ListItemText primary={user.login}/>
      {!!actions ? actions : null}
    </ListItem>
  )
  , listItemWithActions: ({user, userId, isHost, roomKickRequest, roomBanRequest}) => (
    <UserVariants.listItem user={user} actions={
      user.id !== userId && isHost && <ListItemSecondaryAction>
        <Tooltip title={T.translate('App.Room.$Kick')}>
          <IconButton onClick={() => roomKickRequest(user.id)}><IconKickUser/></IconButton>
        </Tooltip>
        <Tooltip title={T.translate('App.Room.$Ban')}>
          <IconButton onClick={() => roomBanRequest(user.id)}><IconBanUser/></IconButton>
        </Tooltip>
      </ListItemSecondaryAction>}
    />
  ),
    withStats: ({user}) => (
        <Link to={"/user/"+user.id} style={{color: "inherit", textDecoration: "none"}}>
            <MenuItem>
                <Grid container style={{justifyContent: "space-between"}}>
                    <Grid item>
                        <Typography>
                            { (user.authType === "Form") ? <AccountBoxIcon style={{verticalAlign: 'middle', fontSize: "18px", height: "14px", margin: "2px"}}/> : (user.authType === "VK")? <img src={VKIcon} style={{verticalAlign: 'middle', height: "14px", margin: "2px"}}/> : ""}
                            {user.login}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {user.rep}
                        </Typography>
                    </Grid>
                </Grid>
            </MenuItem>
        </Link>
    )
};

export const UserConnected = connect(
  (state, {id}) => ({
    id
    , user: state.getIn(['online', id], defaultUser(id))
  })
)(({children, variant, ...props}) => children ? children(props) : UserVariants[variant](props));

UserConnected.propTypes = {
  id: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['simple', 'typography', 'listItem', 'listItemWithActions'])
};
UserConnected.defaultProps = {
  variant: 'typography'
};

export default UserConnected;