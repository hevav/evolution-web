import {Map, fromJS} from 'immutable';
import {UserRecord} from '../models/User';
import {authServerToClient, authClientToServer, socketConnect, socketDisconnect, loginUserRequest, loginUserSuccess, loginUserFailure} from './auth';

describe('Auth testing', () => {
  it('socketConnect', () => {
    const serverStore = mockServerStore(Map());
    serverStore.dispatch(socketConnect('1', 'socket'));
    expect(serverStore.getActions()).eql([{
      type: 'socketConnect',
      data: {connectionId: '1', socket: 'socket'}
    }]);
    expect(serverStore.getState()).equal(fromJS({connections: {'1': 'socket'}, users: {}}));
  });

  it('socketDisconnect', () => {
    const serverStore = mockServerStore(fromJS({
      connections: {
        '0': 'socket', '1': 'socket'
      }
      , users: {
        '0': new UserRecord({id: '0', connectionId: '0'})
        , '1': new UserRecord({id: '1', connectionId: '1'})
      }
    }));

    serverStore.dispatch(socketDisconnect('1'));

    expect(serverStore.getActions(), 'serverStore.getActions()').eql([
      {type: 'logoutUser', data: '1', meta: {clients: true}}
      , {type: 'socketDisconnect', data: {connectionId: '1'}}
    ]);

    expect(serverStore.getState()).equal(fromJS({
      connections: {'0': 'socket'}
      , users: {'0': new UserRecord({id: '0', connectionId: '0'})}
    }));
  });

  describe('loginUserRequest', () => {
    it('valid Connection, single User', () => {
      const CONNECTION_ID = '3';
      const User0 = new UserRecord({id: '0', login: 'testLogin', connectionId: CONNECTION_ID});

      const serverStore = mockServerStore();
      const clientStore = mockClientStore(void 0, serverStore, CONNECTION_ID);
      const cs1 = () => clientStore;

      serverStore.dispatch(socketConnect(CONNECTION_ID, cs1));
      serverStore.clearActions();

      clientStore.dispatch(loginUserRequest('/test', User0.login, 'testPassword'));

      //console.log('serverStore');
      //console.log('---');
      //console.log('state', serverStore.getState().toJS());
      //console.log('---');
      //console.log('actions', serverStore.getActions());
      //console.log('---');
      //console.log('clientStore');
      //console.log('---');
      //console.log('state', clientStore.getState().toJS());
      //console.log('---');
      //console.log('actions', clientStore.getActions());
      //console.log('---');

      expect(serverStore.getState()).equal(fromJS({
        users: {'0': User0},
        connections: {'3': cs1}
      }));

      expect(clientStore.getState()).equal(fromJS({
        users: {
          token: null,
          user: User0.toSecure(),
          isAuthenticated: true,
          isAuthenticating: false,
          statusText: 'You have been successfully logged in.'
        }
        , online: [User0.toSecure()]
      }));

      expect(serverStore.getActions()).eql([{
        type: 'onlineJoin',
        data: {user: User0.toSecure()},
        meta: {clients: true}
      }, {
        type: 'loginUserSuccess',
        data: {
          user: User0,
          redirect: '/test'
        },
        meta: {connectionId: '3'}
      }, {
        type: 'onlineSet',
        data: {users: [User0.toSecure()]},
        meta: {connectionId: '3'}
      }]);

      expect(clientStore.getActions()).eql([{
        type: 'loginUserRequest',
        data: {
          redirect: '/test',
          login: 'testLogin',
          password: 'testPassword'
        },
        meta: {server: true}
      }, {
        type: 'onlineJoin', data: {user: User0.toSecure()}
      }, {
        type: 'loginUserSuccess',
        data: {user: User0}
      }, {
        type: '@@router/CALL_HISTORY_METHOD',
        payload: {method: 'push', args: ['/test']}
      }, {
        type: 'onlineSet', data: {users: [User0.toSecure()]}
      }]);
    });

    it('valid Connection, two Users', () => {
      const CONNECTION_ID_0 = '0';
      const CONNECTION_ID_1 = '1';
      const User0 = new UserRecord({id: '1', login: 'User0', connectionId: CONNECTION_ID_0});
      const User1 = new UserRecord({id: '2', login: 'User1', connectionId: CONNECTION_ID_1});

      const serverStore = mockServerStore();
      const clientStore0 = mockClientStore(void 0, serverStore, CONNECTION_ID_0);
      const clientStore1 = mockClientStore(void 0, serverStore, CONNECTION_ID_1);
      const cs0 = () => clientStore0;
      const cs1 = () => clientStore1;

      serverStore.dispatch(socketConnect(CONNECTION_ID_0, cs0));
      serverStore.dispatch(socketConnect(CONNECTION_ID_1, cs1));
      serverStore.clearActions();

      clientStore0.dispatch(loginUserRequest('/test', User0.login, 'testPassword'));

      expect(serverStore.getState(), 'serverStore.getState()').equal(fromJS({
        connections: {'0': cs0, '1': cs1}
        , users: {'1': User0}
      }));

      expect(clientStore0.getState(), 'clientStore0.getState()').equal(fromJS({
        users: {
          token: null,
          user: User0.toSecure(),
          isAuthenticated: true,
          isAuthenticating: false,
          statusText: 'You have been successfully logged in.'
        }
        , online: [User0.toSecure()]
      }));

      expect(clientStore1.getState(), 'clientStore1.getState()').equal(fromJS({
        users: {
          token: null,
          user: null,
          isAuthenticated: false,
          isAuthenticating: false,
          statusText: null
        }
        , online: [User0.toSecure()]
      }));

      clientStore1.dispatch(loginUserRequest('/test', User1.login, 'testPassword'));

      expect(clientStore0.getState(), 'clientStore0.getState()').equal(fromJS({
        users: {
          token: null,
          user: User0.toSecure(),
          isAuthenticated: true,
          isAuthenticating: false,
          statusText: 'You have been successfully logged in.'
        }
        , online: [User0.toSecure(), User1.toSecure()]
      }));

      expect(clientStore1.getState(), 'clientStore1.getState()').equal(fromJS({
        users: {
          token: null,
          user: User1.toSecure(),
          isAuthenticated: true,
          isAuthenticating: false,
          statusText: 'You have been successfully logged in.'
        }
        , online: [User0.toSecure(), User1.toSecure()]
      }));
    });
  });
});