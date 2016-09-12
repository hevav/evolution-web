import {Map, List, fromJS} from 'immutable';
import {UserModel} from '../models/UserModel';
import {RoomModel} from '../models/RoomModel';
import {loginUserRequest, roomCreateRequest, roomJoinRequest, roomExitRequest} from '../actions/actions';
import {selectRoom} from '../selectors';

describe('Rooms:', function () {
  describe('Lifecycle:', function () {
    it('Simple Create', () => {
      const [serverStore, {clientStore0, User0}] = mockStores(1);
      clientStore0.dispatch(roomCreateRequest());
      const Room = serverStore.getState().get('rooms').first();
      expect(serverStore.getState().get('rooms'), 'serverStore.rooms').equal(Map({[Room.id]: Room}));
      expect(clientStore0.getState().get('room'), 'clientStore.room').equal(Room.id);
      expect(clientStore0.getState().get('rooms'), 'clientStore.rooms').equal(Map({[Room.id]: Room}));
    });

    it('Simple Join', () => {
      const [serverStore, {clientStore0, User0}, {clientStore1, User1}] = mockStores(2);
      clientStore0.dispatch(roomCreateRequest());
      const Room = serverStore.getState().get('rooms').first();
      const Room2 = new RoomModel({
        ...Room.toJS()
        , users: List([User0.id, User1.id])
      });
      clientStore1.dispatch(roomJoinRequest(Room.id));
      expect(serverStore.getState().get('rooms'), 'serverStore.rooms').equal(Map({[Room.id]: Room2}));
      expect(clientStore0.getState().get('room'), 'clientStore0.room').equal(Room.id);
      expect(clientStore0.getState().get('rooms'), 'clientStore0.rooms').equal(Map({[Room.id]: Room2}));
      expect(clientStore1.getState().get('room'), 'clientStore0.room').equal(Room.id);
      expect(clientStore1.getState().get('rooms'), 'clientStore0.rooms').equal(Map({[Room.id]: Room2}));
    });

    it('User0 creates Room, User1 logins', () => {
      const serverStore = mockServerStore();
      const clientStore0 = mockClientStore().connect(serverStore);
      const clientStore1 = mockClientStore().connect(serverStore);

      clientStore0.dispatch(loginUserRequest('/test', 'User0', 'testPassword'));
      clientStore0.dispatch(roomCreateRequest());

      const Room = serverStore.getState().get('rooms').first();

      clientStore1.dispatch(loginUserRequest('/test', 'User1', 'testPassword'));

      expect(serverStore.getState().get('rooms'), 'serverStore.rooms').equal(Map({
        [Room.id]: Room
      }));

      expect(clientStore0.getState().get('room'), 'clientStore0.room').equal(Room.id);
      expect(clientStore0.getState().get('rooms'), 'clientStore0.rooms').equal(Map({[Room.id]: Room}));

      expect(clientStore1.getState().get('room'), 'clientStore1.room').equal(null);
      expect(clientStore1.getState().get('rooms'), 'clientStore1.rooms').equal(Map({[Room.id]: Room}));
    });

    it('User0, User1 in Room, User0 exits, User1 exits', () => {
      const Room = RoomModel.new();
      const [serverStore, {clientStore0, User0}, {clientStore1, User1}] = mockStores(2, Map({rooms: Map({[Room.id]: Room})}));
      clientStore0.dispatch(roomJoinRequest(Room.id));
      clientStore1.dispatch(roomJoinRequest(Room.id));
      clientStore0.dispatch(roomExitRequest());

      expect(selectRoom(serverStore.getState, Room.id).users).equal(List.of(User1.id));
      expect(clientStore0.getState().get('room'), 'clientStore0.room').equal(null);
      expect(selectRoom(clientStore0.getState, Room.id).users, 'clientStore0.rooms').equal(List.of(User1.id));
      expect(clientStore1.getState().get('room'), 'clientStore1.room').equal(Room.id);
      expect(selectRoom(clientStore1.getState, Room.id).users, 'clientStore1.rooms').equal(List.of(User1.id));

      clientStore1.dispatch(roomExitRequest());

      expect(serverStore.getState().get('rooms')).equal(Map());
      expect(clientStore0.getState().get('room'), 'clientStore0.room').null;
      expect(clientStore0.getState().get('rooms')).equal(Map());
      expect(clientStore1.getState().get('room'), 'clientStore1.room').null;
      expect(clientStore1.getState().get('rooms')).equal(Map());
    });

    it('User0, User1 in Room, User0 disconnects, User1 disconnects', (done) => {
      const Room = RoomModel.new();
      const [serverStore, {clientStore0, User0}, {clientStore1, User1}]= mockStores(2, Map({rooms: Map({[Room.id]: Room})}));
      clientStore0.dispatch(roomJoinRequest(Room.id));
      clientStore1.dispatch(roomJoinRequest(Room.id));

      serverStore.clearActions();
      clientStore0.getClient().disconnect();
      setTimeout(() => {
        expect(selectRoom(serverStore.getState, Room.id).users).equal(List.of(User1.id));
        expect(clientStore0.getState().get('room'), 'clientStore0.room').equal(null);
        expect(clientStore0.getState().get('rooms')).equal(Map());
        expect(clientStore1.getState().get('room'), 'clientStore1.room').equal(Room.id);
        expect(selectRoom(clientStore1.getState, Room.id).users).equal(List.of(User1.id));

        clientStore1.getClient().disconnect();

        setTimeout(() => {
          expect(serverStore.getState().get('rooms')).equal(Map());
          expect(clientStore1.getState().get('rooms')).equal(Map());
          expect(clientStore1.getState().get('room'), 'clientStore0.room').equal(null);
          done();
        }, 5);
      }, 5);
    });

    it('User0, User1 in Room, User0 disconnects, User0 rejoins', (done) => {
      const Room = RoomModel.new();
      const [serverStore, {clientStore0, User0}, {clientStore1, User1}]= mockStores(2, Map({rooms: Map({[Room.id]: Room})}));
      clientStore0.dispatch(roomJoinRequest(Room.id));
      clientStore1.dispatch(roomJoinRequest(Room.id));

      serverStore.clearActions();
      clientStore0.clearActions();
      clientStore0.getClient().disconnect();

      expect(selectRoom(serverStore.getState, Room.id).users).equal(List.of(User0.id, User1.id));
      expect(clientStore0.getState().get('room'), 'clientStore0.room').equal(null);
      expect(clientStore0.getState().get('rooms')).equal(Map());
      expect(clientStore1.getState().get('room'), 'clientStore1.room').equal(Room.id);
      expect(selectRoom(clientStore1.getState, Room.id).users).equal(List.of(User0.id, User1.id));

      clientStore0.connect(serverStore);

      //TODO enable rejoin func
      expect(clientStore0.getState().get('room'), 'clientStore0.room').equal(Room.id);
      expect(clientStore1.getState().get('room'), 'clientStore1.room').equal(Room.id);
      expect(selectRoom(serverStore.getState, Room.id).users).equal(List.of(User0.id, User1.id));
      expect(selectRoom(clientStore0.getState, Room.id).users).equal(List.of(User0.id, User1.id));
      expect(selectRoom(clientStore1.getState, Room.id).users).equal(List.of(User0.id, User1.id));

      setTimeout(() => {
        expect(clientStore0.getState().get('room'), 'clientStore0.room').equal(Room.id);
        expect(clientStore1.getState().get('room'), 'clientStore1.room').equal(Room.id);
        expect(selectRoom(serverStore.getState, Room.id).users).equal(List.of(User0.id, User1.id));
        expect(selectRoom(clientStore0.getState, Room.id).users).equal(List.of(User0.id, User1.id));
        expect(selectRoom(clientStore1.getState, Room.id).users).equal(List.of(User0.id, User1.id));
      }, 5);
      done();
    });
  });
  describe('Errors:', function () {
    it('User0 joins into same room', () => {
      const Room = RoomModel.new();
      const [serverStore, {clientStore0, User0}]= mockStores(1, Map({rooms: Map({[Room.id]: Room})}));
      clientStore0.dispatch(roomJoinRequest(Room.id));
      clientStore0.dispatch(roomJoinRequest(Room.id));
      const newRoom = serverStore.getState().getIn(['rooms', Room.id]);
      expect(newRoom.users).equal(List.of(User0.id));
    });
    it('User0 joins into another room', () => {
      const Room0 = RoomModel.new();
      const Room1 = RoomModel.new();
      const [serverStore, {clientStore0, User0}, {clientStore1, User1}]= mockStores(2, Map({
        rooms: Map({
          [Room0.id]: Room0
          , [Room1.id]: Room1
        })
      }));
      clientStore0.dispatch(roomJoinRequest(Room0.id));
      clientStore1.dispatch(roomJoinRequest(Room0.id));
      clientStore1.dispatch(roomJoinRequest(Room1.id));
      const newRoom0 = serverStore.getState().getIn(['rooms', Room0.id]);
      const newRoom1 = serverStore.getState().getIn(['rooms', Room1.id]);
      expect(newRoom0.users).equal(List.of(User0.id));
      expect(newRoom1.users).equal(List.of(User1.id));
    });
  });
});