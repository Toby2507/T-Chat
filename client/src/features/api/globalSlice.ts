import { createSlice, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { messageInterface, stateInterface } from "../../utilities/interfaces";

const initialState: stateInterface = { user: null, accessToken: null, currentChat: null, showChatBox: false };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<EntityId>) => {
      state.currentChat = action.payload;
    },
    toggleChatBox: (state, action: PayloadAction<{ show: boolean, id: EntityId | null; }>) => {
      state.showChatBox = action.payload.show;
      state.currentChat = action.payload.id;
    },
    setCredentials: (state, action: PayloadAction<stateInterface>) => {
      const { user, accessToken } = action.payload;
      if (user) state.user = user;
      if (accessToken) state.accessToken = accessToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.currentChat = null;
      state.showChatBox = false;
    },
    sendMsgThroughSocket: (state, action: PayloadAction<messageInterface>) => { },
    recieveMsgFromSocket: (state) => { },
    startApp: (state) => { },
  }
});

export const { setCredentials, clearCredentials, setCurrentChat, toggleChatBox, sendMsgThroughSocket, recieveMsgFromSocket, startApp } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectChat = (state: RootState) => state.user.currentChat;
export const showChatBox = (state: RootState) => state.user.showChatBox;
export default userSlice.reducer;