import { EntityId, TypedStartListening, createListenerMiddleware } from "@reduxjs/toolkit";
import { Socket, io } from "socket.io-client";
import { apiSlice } from "../features/api/apiSlice";
import { accountDeletedFromSocket, addNewGroup, addToGroupThroughSocket, addedToGroupFromSocket, blockUserThroughSocket, createNewUserThroughSocket, deleteAccountThroughSocket, deleteGroupThroughSocket, deleteUserAccount, deletedGroupFromSocket, editGroupInfoThroughSocket, editUserInfoThroughSocket, editedGroupInfoFromSocket, editedUserInfoFromSocket, newUserCreatedFromSocket, recieveMsgFromSocket, removeFromGroupThroughSocket, removeGroup, removedFromGroupFromSocket, sendMsgThroughSocket, startApp, toggleChatBox, toggleProfile, updateOnlineUsers, updateOnlineUsersFromSocket, userBlockedMeFromSocket } from "../features/api/globalSlice";
import { authSlice, usersAdapter } from "../features/auth/authSlice";
import { chatSlice, messagesAdapter } from "../features/chats/chatSlice";
import { ClientToServerEvents, ServerToClientEvents, groupInterface, userInterface } from "../utilities/interfaces";
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
  effect: action => {
    socket.emit('send_msg', action.payload);
  }
});

startAppListening({
  actionCreator: addToGroupThroughSocket,
  effect: action => {
    socket.emit('add_to_group', action.payload);
  }
});

startAppListening({
  actionCreator: removeFromGroupThroughSocket,
  effect: action => {
    socket.emit('remove_from_group', action.payload);
  }
});


startAppListening({
  actionCreator: deleteGroupThroughSocket,
  effect: action => {
    socket.emit('delete_group', action.payload);
  }
});

startAppListening({
  actionCreator: editGroupInfoThroughSocket,
  effect: action => {
    socket.emit('edit_group', action.payload);
  }
});

startAppListening({
  actionCreator: blockUserThroughSocket,
  effect: action => {
    socket.emit('block_user', action.payload);
  }
});

startAppListening({
  actionCreator: deleteAccountThroughSocket,
  effect: action => {
    socket.emit('delete_account', action.payload);
  }
});

startAppListening({
  actionCreator: createNewUserThroughSocket,
  effect: action => {
    socket.emit('create_new_user', action.payload);
  }
});

startAppListening({
  actionCreator: editUserInfoThroughSocket,
  effect: action => {
    socket.emit('edit_user', action.payload);
  }
});

startAppListening({
  actionCreator: newUserCreatedFromSocket,
  effect: (action, listenerApi) => {
    socket.on('new_user_created', data => {
      usersAdapter.addOne(usersAdapter.getInitialState(), data);
      listenerApi.dispatch(apiSlice.util.invalidateTags([{ type: 'Users' as const, id: 'LIST' }]));
      setTimeout(() => { listenerApi.dispatch(startApp({ refetch: true })); }, 1000);
    });
  }
});

startAppListening({
  actionCreator: updateOnlineUsersFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('online_users', onlineUsers => {
      listenerApi.dispatch(updateOnlineUsers(onlineUsers));
    });
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
          if (newUser.messages.map(msg => msg.id).includes(data.id)) return;
          newUser.messages = [...newUser.messages, { id: data.id, isInformational: data.isInformational }];
          newUser.lastUpdated = data.datetime;
          if (!data.isInformational) {
            newUser.unread = [...newUser.unread, data.id];
          }
        }
      }));
    });
  }
});

startAppListening({
  actionCreator: addedToGroupFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('added_to_group', data => {
      usersAdapter.addOne(usersAdapter.getInitialState(), data);
      listenerApi.dispatch(addNewGroup(data._id));
      listenerApi.dispatch(apiSlice.util.invalidateTags([{ type: 'Users' as const, id: 'LIST' }]));
      setTimeout(() => { listenerApi.dispatch(startApp({ refetch: true })); }, 1000);
    });
  },
});

startAppListening({
  actionCreator: removedFromGroupFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('removed_from_group', arg => {
      listenerApi.dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
        const group = draft.entities[arg.groupId] as groupInterface;
        if (group) {
          group.members = group.members.filter(member => member !== arg.userId);
          usersAdapter.updateOne(usersAdapter.getInitialState(), { id: arg.groupId, changes: group });
        }
      }));
    });
  }
});

startAppListening({
  actionCreator: deletedGroupFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('deleted_group', arg => {
      const state = listenerApi.getState() as RootState;
      const currentChat = state.user.currentChat.id;
      usersAdapter.removeOne(usersAdapter.getInitialState(), arg._id as string);
      listenerApi.dispatch(removeGroup(arg._id as string));
      listenerApi.dispatch(apiSlice.util.invalidateTags([{ type: 'Users' as const, id: 'LIST' }]));
      setTimeout(() => { listenerApi.dispatch(startApp({ refetch: true })); }, 1000);
      if (currentChat === arg._id) {
        listenerApi.dispatch(toggleChatBox({ show: false, chat: { id: '', isGroup: false } }));
        listenerApi.dispatch(toggleProfile(false));
      }
    });
  }
});

startAppListening({
  actionCreator: editedGroupInfoFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('editted_group', arg => {
      listenerApi.dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
        const group = draft.entities[arg._id as string] as groupInterface;
        if (group) {
          arg.userName && (group.userName = arg.userName);
          arg.description !== undefined && (group.description = arg.description);
          arg.profilePicture !== undefined && (group.profilePicture = arg.profilePicture);
          arg.members && (group.members = arg.members);
          arg.admins && (group.admins = arg.admins);
          usersAdapter.updateOne(usersAdapter.getInitialState(), { id: arg._id as string, changes: group });
        }
      }));
    });
  }
});

startAppListening({
  actionCreator: editedUserInfoFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('editted_user', arg => {
      listenerApi.dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
        const user = draft.entities[arg._id as string] as userInterface;
        if (user) {
          arg.userName && (user.userName = arg.userName);
          arg.profilePicture !== undefined && (user.profilePicture = arg.profilePicture);
          usersAdapter.updateOne(usersAdapter.getInitialState(), { id: arg._id as string, changes: user });
        }
      }));
    });
  }
});

startAppListening({
  actionCreator: userBlockedMeFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('blocked_me', arg => {
      listenerApi.dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
        const user = draft.entities[arg.userId] as userInterface;
        if (user) {
          user.blockedMe = arg.block;
          usersAdapter.updateOne(usersAdapter.getInitialState(), { id: arg.userId, changes: user });
        }
      }));
    });
  }
});

startAppListening({
  actionCreator: accountDeletedFromSocket,
  effect: async (action, listenerApi) => {
    socket.on('deleted_account', async userId => {
      listenerApi.dispatch(deleteUserAccount(userId));
      listenerApi.dispatch(apiSlice.util.invalidateTags([{ type: 'Users' as const, id: 'LIST' }]));
      setTimeout(() => { listenerApi.dispatch(startApp({ refetch: true })); }, 1000);
    });
  }
});

startAppListening({
  actionCreator: startApp,
  effect: async (action, listenerApi) => {
    const { refetch } = action.payload;
    const state = listenerApi.getState() as RootState;
    let userIds = authSlice.endpoints.getUsers.select()(state).data?.entities;
    if (userIds) {
      Object.values(userIds).forEach(user => { listenerApi.dispatch(chatSlice.endpoints.getMessages.initiate({ to: user?._id as EntityId, isGroup: user?.isGroup as boolean }, { subscribe: !refetch, forceRefetch: refetch })); });
    }
  }
});