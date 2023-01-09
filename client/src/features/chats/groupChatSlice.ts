import { EntityState } from "@reduxjs/toolkit";
import { RootState, store } from "../../app/store";
import { groupInterface, userInterface } from "../../utilities/interfaces";
import { apiSlice } from "../api/apiSlice";
import { addNewGroup, toggleChatBox } from "../api/globalSlice";
import { usersAdapter } from "../auth/authSlice";

export const groupChatSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createGroupChat: builder.mutation<EntityState<userInterface | groupInterface>, { name: string, description: string, members: string[]; }>({
      query: body => ({
        url: "groupchat/create",
        method: "POST",
        body: { ...body }
      }),
      transformResponse: (res: groupInterface) => {
        const state = store.getState() as RootState;
        const myInfo = state.user.user;
        let group = res;
        if (myInfo?.archivedChats.includes(group._id)) { group.isArchived = true; } else { group.isArchived = false; }
        if (myInfo?.mutedUsers.includes(group._id)) { group.isMuted = true; } else { group.isMuted = false; }
        group = { ...group, messages: [], unread: [], lastUpdated: Date.now(), isGroup: true };
        return usersAdapter.addOne(usersAdapter.getInitialState(), group);
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        const newGroup = result.data.ids[0] as string;
        dispatch(addNewGroup(newGroup));
        dispatch(toggleChatBox({ show: true, chat: { id: newGroup, isGroup: true } }));
      },
      invalidatesTags: [{ type: 'Users' as const, id: 'LIST' }]
    }),
  })
});

export const { useCreateGroupChatMutation } = groupChatSlice;