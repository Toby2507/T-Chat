import { EntityId, EntityState } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { groupInterface, userInterface } from "../../utilities/interfaces";
import { apiSlice } from "../api/apiSlice";
import { addNewGroup, addToGroupThroughSocket, deleteGroupThroughSocket, editGroupInfoThroughSocket, removeFromGroupThroughSocket, removeGroup, startApp, toggleChatBox, toggleProfile } from "../api/globalSlice";
import { authSlice, usersAdapter } from "../auth/authSlice";
import { chatSlice } from "./chatSlice";

export const groupChatSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createGroupChat: builder.mutation<EntityState<userInterface | groupInterface>, { name: string, description: string, members: string[]; }>({
      query: body => ({
        url: "groupchat/create",
        method: "POST",
        body: { ...body }
      }),
      transformResponse: (res: groupInterface) => {
        const group = { ...res, messages: [], unread: [], lastUpdated: Date.now(), isGroup: true, isArchived: false, isMuted: false };
        return usersAdapter.addOne(usersAdapter.getInitialState(), group);
      },
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        const myId = (getState() as RootState).user.user?._id;
        const entities = { ...result.data.entities };
        const newGroup = Object.values(entities)[0] as groupInterface;
        newGroup.members.forEach(member => {
          if (member !== myId) {
            // SEND AN ALERT TO ALERT MEMBERS 
            const socketData = { ...newGroup, to: member as string, by: myId as string };
            dispatch(addToGroupThroughSocket(socketData));
            // SEND INFORMATIONAL MESSAGES TO GROUP
            dispatch(chatSlice.endpoints.sendMessage.initiate({ message: `${myId} Added ${member}`, to: newGroup._id, members: newGroup.members as string[], isInformational: true }));
          }
        });
        dispatch(addNewGroup(newGroup._id));
        dispatch(apiSlice.util.invalidateTags([{ type: 'Users' as const, id: 'LIST' }]));
        dispatch(toggleChatBox({ show: true, chat: { id: newGroup._id, isGroup: true } }));
        setTimeout(() => { dispatch(startApp({ refetch: true })); }, 1000);
      }
    }),
    editGroupInfo: builder.mutation<unknown, { groupId: EntityId, name: string, description: string; }>({
      query: body => ({
        url: "groupchat/edit",
        method: "PATCH",
        body: { ...body }
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        await queryFulfilled;
        const state = getState() as RootState;
        const myId = state.user.user?._id;
        const group = authSlice.endpoints.getUsers.select()(state).data?.entities[arg.groupId] as groupInterface;
        if (group) {
          group.members.forEach(member => {
            if (member !== myId) {
              dispatch(editGroupInfoThroughSocket({ to: member as string, _id: arg.groupId as string, userName: arg.name, description: arg.description }));
            }
          });
        }
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const group = draft.entities[arg.groupId] as groupInterface;
          if (group) {
            group.userName = arg.name;
            group.description = arg.description;
            usersAdapter.updateOne(draft, { id: arg.groupId, changes: group });
          }
        }));
      }
    }),
    groupAdminHandler: builder.mutation<unknown, { groupId: EntityId, userId: EntityId, prev: boolean; }>({
      query: ({ groupId, userId }) => ({
        url: `groupchat/makeadmin/${groupId}/${userId}`,
        method: "PATCH"
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        await queryFulfilled;
        const state = getState() as RootState;
        const myId = state.user.user?._id;
        const group = authSlice.endpoints.getUsers.select()(state).data?.entities[arg.groupId] as groupInterface;
        if (group) {
          const admins = group.admins.includes(arg.userId) ? group.admins : [...group.admins, arg.userId];
          const finalAdmins = arg.prev ? admins.filter(admin => admin !== arg.userId) : admins;
          group.members.forEach(member => {
            if (member !== myId) {
              dispatch(editGroupInfoThroughSocket({ to: member as string, _id: arg.groupId as string, admins: finalAdmins }));
            }
          });
        }
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const group = draft.entities[arg.groupId] as groupInterface;
          if (group) {
            group.admins = group.admins.includes(arg.userId) ? group.admins.filter(admin => admin !== arg.userId) : [...group.admins, arg.userId];
            usersAdapter.updateOne(draft, { id: arg.groupId, changes: group });
          }
        }));
      }
    }),
    setProfilePicture: builder.mutation<Partial<groupInterface>, { groupId: EntityId, formData: FormData; }>({
      query: ({ groupId, formData }) => ({
        url: `groupchat/setprofilepicture/${groupId}`,
        method: "PATCH",
        body: formData
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        const state = getState() as RootState;
        const myId = state.user.user?._id;
        const group = authSlice.endpoints.getUsers.select()(state).data?.entities[arg.groupId] as groupInterface;
        if (group) {
          group.members.forEach(member => {
            if (member !== myId) {
              dispatch(editGroupInfoThroughSocket({ to: member as string, _id: arg.groupId as string, profilePicture: result.data.profilePicture as string }));
            }
          });
        }
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const group = draft.entities[arg.groupId] as groupInterface;
          if (group) {
            group.profilePicture = result.data.profilePicture as string;
            usersAdapter.updateOne(draft, { id: arg.groupId, changes: group });
          }
        }));
      }
    }),
    removeProfilePicture: builder.mutation<unknown, EntityId>({
      query: groupId => ({
        url: `groupchat/removeprofilepicture/${groupId}`,
        method: 'PATCH'
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        await queryFulfilled;
        const state = getState() as RootState;
        const myId = state.user.user?._id;
        const group = authSlice.endpoints.getUsers.select()(state).data?.entities[arg] as groupInterface;
        if (group) {
          group.members.forEach(member => {
            if (member !== myId) {
              dispatch(editGroupInfoThroughSocket({ to: member as string, _id: arg as string, profilePicture: null }));
            }
          });
        }
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const group = draft.entities[arg] as groupInterface;
          if (group) {
            group.profilePicture = null;
            usersAdapter.updateOne(draft, { id: arg, changes: group });
          }
        }));
      }
    }),
    leaveGroupChat: builder.mutation<{ admins: string[]; }, EntityId>({
      query: groupId => ({
        url: `groupchat/leave/${groupId}`,
        method: "PATCH"
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        const state = getState() as RootState;
        const myId = state.user.user?._id;
        const group = authSlice.endpoints.getUsers.select()(state).data?.entities[arg] as groupInterface;
        if (group) {
          group.members.forEach(member => {
            if (member !== myId) {
              dispatch(removeFromGroupThroughSocket({ to: member as string, groupId: arg as string, userId: myId as string }));
              dispatch(editGroupInfoThroughSocket({ to: member as string, _id: arg as string, admins: result.data.admins }));
            }
          });
          dispatch(chatSlice.endpoints.sendMessage.initiate({ message: `${myId} Left`, to: group._id, members: group.members as string[], isInformational: true }));
        }
        usersAdapter.removeOne(usersAdapter.getInitialState(), arg);
        dispatch(removeGroup(arg));
        dispatch(apiSlice.util.invalidateTags([{ type: 'Users' as const, id: 'LIST' }]));
        dispatch(toggleChatBox({ show: false, chat: { id: '', isGroup: false } }));
        dispatch(toggleProfile(false));
        setTimeout(() => { dispatch(startApp({ refetch: true })); }, 1000);
      }
    }),
    addGroupMember: builder.mutation<unknown, { groupId: EntityId, members: EntityId[]; }>({
      query: body => ({
        url: `groupchat/add`,
        method: "PATCH",
        body: { ...body }
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        await queryFulfilled;
        const state = getState() as RootState;
        const myId = state.user.user?._id;
        const group = authSlice.endpoints.getUsers.select()(state).data?.entities[arg.groupId] as groupInterface;
        if (group) {
          const finalargMembers = arg.members.filter(member => !group.members.includes(member));
          const members = [...group.members, ...finalargMembers] as string[];
          group.members.forEach(member => {
            if (member !== myId) {
              dispatch(editGroupInfoThroughSocket({ to: member as string, _id: arg.groupId as string, members }));
            }
          });
          arg.members.forEach(member => {
            const socketData = { ...group, members, to: member as string, by: myId as string };
            dispatch(addToGroupThroughSocket(socketData));
            dispatch(chatSlice.endpoints.sendMessage.initiate({ message: `${myId} Added ${member}`, to: group._id, members, isInformational: true }));
          });
        }
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const group = draft.entities[arg.groupId] as groupInterface;
          if (group) {
            group.members = [...group.members, ...arg.members];
            usersAdapter.updateOne(draft, { id: arg.groupId, changes: group });
          }
        }));
      }
    }),
    removeGroupMember: builder.mutation<unknown, { groupId: EntityId, userId: EntityId; }>({
      query: body => ({
        url: "groupchat/remove",
        method: "PATCH",
        body: { ...body }
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        await queryFulfilled;
        const state = getState() as RootState;
        const myId = state.user.user?._id;
        const group = authSlice.endpoints.getUsers.select()(state).data?.entities[arg.groupId] as groupInterface;
        if (group) {
          group.members.forEach(member => {
            if (member !== myId && member !== arg.userId) {
              dispatch(removeFromGroupThroughSocket({ to: member as string, groupId: arg.groupId as string, userId: arg.userId as string }));
            } else if (member === arg.userId) {
              dispatch(deleteGroupThroughSocket({ to: member as string, _id: arg.groupId as string }));
            }
          });
          dispatch(chatSlice.endpoints.sendMessage.initiate({ message: `${myId} Removed ${arg.userId}`, to: group._id, members: group.members as string[], isInformational: true }));
        }
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const group = draft.entities[arg.groupId] as groupInterface;
          if (group) {
            group.members = group.members.filter(member => member !== arg.userId);
            usersAdapter.updateOne(draft, { id: arg.groupId, changes: group });
          }
        }));
      }
    }),
    deleteGroupChat: builder.mutation<unknown, { groupId: string, members: string[]; }>({
      query: body => ({
        url: "groupchat/delete",
        method: "DELETE",
        body: { ...body }
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        await queryFulfilled;
        usersAdapter.removeOne(usersAdapter.getInitialState(), arg.groupId);
        const myId = (getState() as RootState).user.user?._id;
        dispatch(removeGroup(arg.groupId));
        dispatch(apiSlice.util.invalidateTags([{ type: 'Users' as const, id: 'LIST' }]));
        dispatch(toggleChatBox({ show: false, chat: { id: '', isGroup: false } }));
        dispatch(toggleProfile(false));
        arg.members.forEach(member => {
          if (member !== myId) {
            const socketData = { to: member as string, _id: arg.groupId };
            dispatch(deleteGroupThroughSocket(socketData));
          }
        });
        setTimeout(() => { dispatch(startApp({ refetch: true })); }, 1000);
      }
    })
  })
});

export const {
  useCreateGroupChatMutation,
  useLeaveGroupChatMutation,
  useRemoveGroupMemberMutation,
  useDeleteGroupChatMutation,
  useEditGroupInfoMutation,
  useSetProfilePictureMutation,
  useRemoveProfilePictureMutation,
  useAddGroupMemberMutation,
  useGroupAdminHandlerMutation
} = groupChatSlice;