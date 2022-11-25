import { createListenerMiddleware, TypedStartListening } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { apiSlice } from "../features/api/apiSlice";
import { recieveMsgFromSocket, sendMsgThroughSocket } from "../features/api/globalSlice";
import { messagesAdapter } from "../features/chats/chatSlice";
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
      listenerApi.dispatch(apiSlice.util.invalidateTags([{ type: 'Messages' as const, id: 'LIST' }]));
    });
  }
});