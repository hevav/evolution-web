import { createStore, compose, applyMiddleware } from 'redux'

// Basic Middleware
import thunk from 'redux-thunk';
import { reduxTimeout } from '~/shared/utils/reduxTimeout'


export default (reducer, initialState, middleware = [], appliedMiddleware = []) => createStore(
  reducer
  , initialState
  , compose(
    applyMiddleware(
      thunk
      , reduxTimeout()
      , (store => next => action => {
        action.user = store.getState().get('user');
        next(action);
      })
      , ...middleware
    )
    , ...appliedMiddleware
  )
);