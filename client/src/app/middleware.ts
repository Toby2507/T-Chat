import { TypedStartListening, createListenerMiddleware } from "@reduxjs/toolkit";
import { Socket, io } from "socket.io-client";
import { apiSlice } from "../features/api/apiSlice";
import { recieveMsgFromSocket, sendMsgThroughSocket, startApp } from "../features/api/globalSlice";
import { authSlice } from "../features/auth/authSlice";
import { chatSlice, messagesAdapter } from "../features/chats/chatSlice";
import { ClientToServerEvents, ServerToClientEvents } from "../utilities/interfaces";
import { AppDispatch, RootState } from "./store";


export const createSocketConnection = createListenerMiddleware();
type AppListener = TypedStartListening<RootState, AppDispatch>;
const startAppListening = createSocketConnection.startListening as AppListener;
let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

startAppListening({
  predicate: (action, currentState, previousState) => {
    return currentState.user.user !== null && currentState.user.accessToken !== null && previousState.user.user?._id !== currentState.user.user._id;
  },
  effect: (action, listenerApi) => {
    const currentUser = listenerApi.getState().user.user?._id;
    socket = io('http://localhost:5000');
    socket.emit('add_user', (currentUser as string));
  }
});

startAppListening({
  actionCreator: sendMsgThroughSocket,
  effect: async (action) => {
    socket.emit('send_msg', action.payload);
  }
});

startAppListening({
  actionCreator: recieveMsgFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('receive_msg', data => {
      messagesAdapter.addOne(messagesAdapter.getInitialState(), data);
      listenerApi.dispatch(apiSlice.util.invalidateTags([{ type: 'Messages' as const, id: data.from }]));
      listenerApi.dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
        const newUser = data.from && draft.entities[data.from];
        if (newUser) {
          newUser.messages = [...newUser.messages, data.id];
          newUser.unread = [...newUser.unread, data.id];
          newUser.lastUpdated = data.datetime;
        }
      }));
    });
  }
});

startAppListening({
  actionCreator: startApp,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const userIds = authSlice.endpoints.getUsers.select()(state).data?.ids;
    if (userIds) {
      userIds.forEach(id => { listenerApi.dispatch(chatSlice.endpoints.getMessages.initiate(id)); });
    }
  }
});