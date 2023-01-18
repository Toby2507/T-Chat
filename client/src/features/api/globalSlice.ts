import { EntityId, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { currentChatInterface, groupInterface, mainUserInterface, messageInterface, stateInterface, userInterface } from "../../utilities/interfaces";
import { setInterface } from "../settings/chatSettingSlice";

const initialState: stateInterface = {
  user: null,
  accessToken: null,
  currentChat: { id: null, isGroup: false },
  showChatBox: false,
  showProfile: false,
  onlineUsers: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<currentChatInterface>) => {
      state.currentChat = action.payload;
    },
    toggleChatBox: (state, action: PayloadAction<{ show: boolean, chat?: currentChatInterface; }>) => {
      state.showChatBox = action.payload.show;
      if (action.payload.chat) { state.currentChat = action.payload.chat; }
    },
    toggleProfile: (state, action: PayloadAction<boolean>) => {
      state.showProfile = action.payload;
    },
    updateOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    updateUserDetails: (state, action: PayloadAction<Partial<mainUserInterface>>) => {
      state.user = { ...state.user as mainUserInterface, ...action.payload };
    },
    deleteUserAccount: (state, action: PayloadAction<string>) => {
      const archived = state.user?.archivedChats.filter(id => id !== action.payload) as string[];
      const muted = state.user?.mutedUsers.filter(id => id !== action.payload) as string[];
      const blocked = state.user?.blockedUsers.filter(id => id !== action.payload) as string[];
      state.user = { ...state.user as mainUserInterface, archivedChats: archived, mutedUsers: muted, blockedUsers: blocked };
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
    addNewGroup: (state, action: PayloadAction<string>) => {
      state.user?.groups.push(action.payload);
    },
    removeGroup: (state, action: PayloadAction<EntityId>) => {
      if (state.user) state.user.groups = state.user?.groups.filter(id => id !== action.payload);
    },
    setCredentials: (state, action: PayloadAction<stateInterface>) => {
      const { user, accessToken } = action.payload;
      if (user) state.user = { ...user };
      if (accessToken) state.accessToken = accessToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.currentChat = { id: null, isGroup: false };
      state.showChatBox = false;
    },
    startApp: (state, action: PayloadAction<{ refetch: boolean; }>) => { },
    sendMsgThroughSocket: (state, action: PayloadAction<messageInterface>) => { },
    addToGroupThroughSocket: (state, action: PayloadAction<groupInterface>) => { },
    removeFromGroupThroughSocket: (state, action: PayloadAction<{ groupId: string, userId: string, to: string; }>) => { },
    deleteGroupThroughSocket: (state, action: PayloadAction<Partial<groupInterface>>) => { },
    editGroupInfoThroughSocket: (state, action: PayloadAction<Partial<groupInterface>>) => { },
    editUserInfoThroughSocket: (state, action: PayloadAction<Partial<groupInterface>>) => { },
    blockUserThroughSocket: (state, action: PayloadAction<{ userId: string, block: boolean; }>) => { },
    deleteAccountThroughSocket: (state, action: PayloadAction<string>) => { },
    createNewUserThroughSocket: (state, action: PayloadAction<userInterface>) => { },
    newUserCreatedFromSocket: (state) => { },
    updateOnlineUsersFromSocket: (state) => { },
    recieveMsgFromSocket: (state) => { },
    addedToGroupFromSocket: (state) => { },
    removedFromGroupFromSocket: (state) => { },
    deletedGroupFromSocket: (state) => { },
    editedGroupInfoFromSocket: (state) => { },
    editedUserInfoFromSocket: (state) => { },
    userBlockedMeFromSocket: (state) => { },
    accountDeletedFromSocket: (state) => { },
  }
});

export const {
  setCredentials,
  clearCredentials,
  setCurrentChat,
  updateUserDetails,
  toggleChatBox,
  toggleProfile,
  deleteUserAccount,
  updateOnlineUsers,
  sendMsgThroughSocket,
  editUserInfoThroughSocket,
  addToGroupThroughSocket,
  removeFromGroupThroughSocket,
  deleteGroupThroughSocket,
  editGroupInfoThroughSocket,
  blockUserThroughSocket,
  deleteAccountThroughSocket,
  createNewUserThroughSocket,
  newUserCreatedFromSocket,
  editedUserInfoFromSocket,
  updateOnlineUsersFromSocket,
  recieveMsgFromSocket,
  addedToGroupFromSocket,
  removedFromGroupFromSocket,
  deletedGroupFromSocket,
  editedGroupInfoFromSocket,
  userBlockedMeFromSocket,
  accountDeletedFromSocket,
  startApp,
  setUserChatOptions,
  addNewGroup,
  removeGroup
} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectChat = (state: RootState) => state.user.currentChat;
export const selectOnlineUsers = (state: RootState) => state.user.onlineUsers;
export const showChatBox = (state: RootState) => state.user.showChatBox;
export const showProfile = (state: RootState) => state.user.showProfile;
export default userSlice.reducer;