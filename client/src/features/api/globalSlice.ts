import { createSlice, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { messageInterface, stateInterface } from "../../utilities/interfaces";
import { setInterface } from "../settings/chatSettingSlice";

const initialState: stateInterface = { user: null, accessToken: null, currentChat: null, showChatBox: false, showProfile: false };

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
    toggleProfile: (state, action: PayloadAction<boolean>) => {
      state.showProfile = action.payload;
    },
    setUserChatOptions: (state, action: PayloadAction<setInterface>) => {
      const { control, set, userId } = action.payload;
      const myInfo = state.user;
      if (myInfo) {
        switch (control) {
          case "archivedChats":
            myInfo.archivedChats = set ? [...myInfo.archivedChats, userId] : myInfo.archivedChats.filter(id => id !== userId);
            break;
          case "blockedUsers":
            myInfo.blockedUsers = set ? [...myInfo.blockedUsers, userId] : myInfo.blockedUsers.filter(id => id !== userId);
            break;
          case "mutedUsers":
            myInfo.mutedUsers = set ? [...myInfo.mutedUsers, userId] : myInfo.mutedUsers.filter(id => id !== userId);
            break;
          default:
            break;
        }
      }
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

export const { setCredentials, clearCredentials, setCurrentChat, toggleChatBox, toggleProfile, sendMsgThroughSocket, recieveMsgFromSocket, startApp, setUserChatOptions } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectChat = (state: RootState) => state.user.currentChat;
export const showChatBox = (state: RootState) => state.user.showChatBox;
export const showProfile = (state: RootState) => state.user.showProfile;
export default userSlice.reducer;