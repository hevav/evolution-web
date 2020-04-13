import logger, {loggerOnline} from '~/shared/utils/logger';
import {Map} from 'immutable';
import {UserModel, RulesLoginPassword, RuleRegisteredUserName} from '../models/UserModel';
import {addTimeout, cancelTimeout} from '../utils/reduxTimeout';
import jwt from 'jsonwebtoken';
import Validator from 'validatorjs';

import {ActionCheckError} from '../models/ActionCheckError';

import {
  db$checkPassword,
  db$findUser,
  db$registerUser,
  db$updatePassword,
  db$updateUserName
} from "../../server/actions/db";
import {formValidationError, server$toUsers, to$, toUser$Client, toUser$ConnectionId} from './generic';
import {chatInit} from './chat';
import {server$roomsInit, server$roomExit, findRoomByUser} from './rooms';

export const SOCKET_DISCONNECT_NOW = 'SOCKET_DISCONNECT_NOW';
export const USER_LOGOUT_TIMEOUT = 120e3;

let md5 = require('md5');

import TimeService from '../../client/services/TimeService';
import {redirectTo} from "../utils/history";
import {AUTH_TYPE} from "../constants";

export const socketConnect = (connectionId, sendToClient, ip) => ({
  type: 'socketConnect'
  , data: {connectionId, sendToClient, ip}
});

export const socketConnectClient = (connectionId, timestamp) => ({
  type: 'socketConnectClient'
  , data: {connectionId, timestamp}
});

export const socketDisconnect = (connectionId, reason) => ({
  type: 'socketDisconnect'
  , data: {connectionId, reason}
});

export const server$socketDisconnect = (connectionId, reason) => (dispatch, getState) => {
  dispatch(socketDisconnect(connectionId, reason));
  const user = getState().get('users').find((user) => user.connectionId == connectionId);
  if (!!user) {
    if (reason !== SOCKET_DISCONNECT_NOW) {
      dispatch(addTimeout(
        USER_LOGOUT_TIMEOUT
        , 'logoutUser' + user.id
        , server$logoutUser(user.id)));
    } else {
      dispatch(server$logoutUser(user.id));
    }
  }
};

/***
 * Login
 */

export const loginUserTokenRequest = (redirect, token) => ({
  type: 'loginUserTokenRequest'
  , data: {redirect, token}
  , meta: {server: true}
});

export const loginUserFormRequest = (redirect, form) => ({
  type: 'loginUserFormRequest'
  , data: {redirect, form}
  , meta: {server: true}
});

export const loginUser = ({user, redirect, online}) => ({
  type: 'loginUser'
  , data: {user, redirect, online}
});

export const loginUserFailure = (error) => ({
  type: 'loginUserFailure'
  , data: {error}
});

export const onlineUpdate = (user) => ({
  type: 'onlineUpdate'
  , data: {user}
});

export const server$loginUser = (user, redirect) => (dispatch, getState) => {
  if (!user.id) throw new Error('User has no ID');
  loggerOnline.info(`User ${user.login} joined`);
  const online = getState().get('users').map(u => u.toOthers());
  const rooms = getState().get('rooms');
  //getState().get('users').forEach(logged_user => (logged_user.id === user.id) && dispatch(server$logoutUser(user.id)));
  dispatch(loginUser({user}));
  dispatch(server$roomsInit(user.id));
  dispatch(toUser$Client(user.id, loginUser({user: user.toClient(), redirect, online})));
  dispatch(toUser$Client(user.id, chatInit(getState().get('chat'))));
  dispatch(to$({clientOnly: true, users: true}, onlineUpdate(user.toOthers().toClient())));
};

/***
 * Logout
 */

const logoutUser = (userId) => ({
  type: 'logoutUser'
  , data: {userId}
});

export const server$logoutUser = (userId) => (dispatch, getState) => {
  logger.debug('server$logoutUser', userId);
  const userLogin = getState().getIn(['users', userId, 'login']);
  const room = findRoomByUser(getState, userId);
  if (room) dispatch(server$roomExit(room.id, userId));
  loggerOnline.info(`User ${userLogin} left`);
  dispatch(Object.assign(logoutUser(userId)
    , {meta: {users: true}}));
};

/***
 * Register
 */

export const server$injectUser = (id, login, authType, rep, irlName, regDate) => (dispatch) => {
  // console.log('dbUser', id, login)
  const user = new UserModel({id, login, authType, rep, irlName, regDate}).sign();
  //getState().get('users').forEach(logged_user => (logged_user.id === user.id) && dispatch(server$logoutUser(user.id)));
  dispatch(loginUser({user}));
  dispatch(addTimeout(
    USER_LOGOUT_TIMEOUT
    , 'logoutUser' + user.id
    , server$logoutUser(user.id)));
  return user;
};

/***
 * Misc
 */

export const userUpdateNameRequest = (name) => ({
  type: 'userUpdateNameRequest'
  , data: {name}
  , meta: {server: true}
});

export const userUpdateName = (userId, name) => ({
  type: 'userUpdateName'
  , data: {userId, name}
});

export const userUpdateNameSelf = (name) => ({
  type: 'userUpdateNameSelf'
  , data: {name}
});

export const server$userUpdateName = (userId, name) => (dispatch, getState) => {
  logger.info(`updating ${userId} with ${name}`);
  db$updateUserName(userId, name)
    .then(_ => {
      dispatch(server$toUsers(userUpdateName(userId, name)));
    });
};

const customErrorReport_PROD = (customErrorAction, fn) => (dispatch, getState) => {
  const result = dispatch(fn);
  if (result instanceof Error) {
    dispatch(customErrorAction(result));
  }
  return null;
};

const customErrorReport_TEST = (customErrorAction, fn) => (dispatch, getState) => {
  try {
    dispatch(fn);
  } catch (error) {
    dispatch(customErrorAction(error));
    throw error;
  }
};

const customErrorReport = !process.env.TEST ? customErrorReport_PROD : customErrorReport_TEST;

export const authClientToServer = {
  loginUserFormRequest: ({redirect = '/', form = {}}, {connectionId}) =>
    customErrorReport(() => Object.assign(loginUserFailure(), {meta: {socketId: connectionId}}), (dispatch, getState) => {
      if (!form) throw new ActionCheckError('loginUserFormRequest', 'form is undefined');
      if (!form.id) throw new ActionCheckError('loginUserFormRequest', 'form has no ID');
      if (!form.login) throw new ActionCheckError('loginUserFormRequest', 'validation failed');
      form.login = form.login.trim();

      const validation = new Validator(form, RulesLoginPassword);
      if (validation.fails()) {
        dispatch(toUser$ConnectionId(connectionId, formValidationError(form.id, validation.errors.all())));
        throw new ActionCheckError('loginUserFormRequest', 'validation failed: %s', JSON.stringify(validation.errors.all()));
      }

      let verifiedFormLogin = replaceCyr(form.login);

      function replaceCyr(textToReplace) {
        let cyr = textToReplace;
        let replaceGrid = {
          "a": "а",
          "A": "А",
          "B": "В",
          "c": "с",
          "C": "С",
          "e": "е",
          "E": "Е",
          "k": "к",
          "K": "К",
          "m": "м",
          "M": "М",
          "H": "Н",
          "o": "о",
          "O": "О",
          "0": "О",
          "p": "р",
          "P": "Р",
          "t": "т",
          "T": "Т",
          "y": "у",
          "Y": "У"
        }
        Object.keys(replaceGrid).map((val) => cyr = cyr.replace(val, replaceGrid[val]));
        return cyr;
      }
      db$findUser(AUTH_TYPE.Form, form.login).then(users => {
        if (form.password === "" && (users || getState().get('users').some(user => replaceCyr(user.login) === verifiedFormLogin))) {
          dispatch(toUser$ConnectionId(connectionId, formValidationError(form.id, {
            login: ['User already exists']
          })));
          throw new ActionCheckError('loginUserFormRequest', 'User already exists');
        }

        if(form.password !== "") {
            if(!users){
              db$registerUser({
                name: form.login,
                rep: 0,
                irlName: form.login,
                regDate: new Date(),
                auth: {
                  type: AUTH_TYPE.Form,
                  name: form.login,
                  id: form.login
                }
              }).then(()=>
                  db$updatePassword(form.login, md5(form.password)).then(()=>
                      dispatch(server$loginUser(new UserModel({login: form.login, connectionId: connectionId, authType: AUTH_TYPE.Form, id: users._id.toString(), rep: 0, irlName: form.login, regDate: new Date()}).sign(), redirect))
                  )
              );
            }
            else
              db$checkPassword(form.login)
                  .then((response) => {
                    if (response.password === md5(form.password)) {
                      dispatch(server$loginUser(new UserModel({login: users.name, connectionId: connectionId, authType: AUTH_TYPE.Form, id: users._id.toString(), rep: users.rep, irlName: users.login, regDate: users.regDate}).sign(), redirect));
                    }
                    else{
                        dispatch(toUser$ConnectionId(connectionId, formValidationError(form.id, {
                            login: ['Wrong password']
                        })));
                        throw new ActionCheckError('loginUserFormRequest', 'Wrong password');
                    }
                  });
        }
        else dispatch(server$loginUser(UserModel.new(form.login, connectionId, null), redirect));
      });
    })
  , loginUserTokenRequest: ({redirect = '/', token}, {connectionId}) =>
    customErrorReport(() => Object.assign(loginUserFailure(), {meta: {socketId: connectionId}}), (dispatch, getState) => {
      logger.silly('server$loginExistingUser', connectionId);
      try {
        jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        throw new ActionCheckError('server$loginExistingUser', `Token not valid (%s)`, token);
      }
      const currentUser = getState().get('users').find(u => u.token === token);
      if (!currentUser) {
        throw new ActionCheckError('server$loginExistingUser', `User not exists (%s)`, token);
      }

      if (getState().get('connections').has(currentUser.connectionId)) {
        dispatch(Object.assign(loginUserFailure(`Duplicate tabs are not supported`)
          , {meta: {clientOnly: true, socketId: currentUser.connectionId}}));
      }

      dispatch(cancelTimeout('logoutUser' + currentUser.id));

      dispatch(server$loginUser(currentUser.set('connectionId', connectionId), redirect));
    })
  , userUpdateNameRequest: ({name}, {userId}) => (dispatch, getState) => {
    name = name.trim();

    const validation = new Validator({name}, {name: RuleRegisteredUserName});

    if (validation.fails()) throw new ActionCheckError('userUpdateNameRequest', 'validation failed: %s', JSON.stringify(validation.errors.all()));

    dispatch(server$userUpdateName(userId, name));
  }
};

export const authServerToClient = {
  loginUser: ({user, redirect = '/', online}) => (dispatch) => {
    user = UserModel.fromJS(user);
    dispatch(loginUser({
      user: user
      , online: Map(online).map(u => new UserModel(u).toOthers())
    }));
  }
  , loginUserFailure: ({error}) => (dispatch, getState) => {
    dispatch(loginUserFailure(error));
  }
  , logoutUser: ({userId}) => logoutUser(userId)
  , socketConnectClient: ({connectionId, timestamp}) => {
    TimeService.setOffset(timestamp);
    return socketConnectClient(connectionId);
  }
  , onlineUpdate: ({user}) => onlineUpdate(UserModel.fromJS(user).toOthers())
  , userUpdateName: ({userId, name}, currentUserId) => (dispatch) => {
    dispatch(userUpdateName(userId, name));
    if (currentUserId === userId) {
      dispatch(userUpdateNameSelf(name));
    }
  }
};