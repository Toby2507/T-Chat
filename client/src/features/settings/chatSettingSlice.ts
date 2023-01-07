import { apiSlice } from "../api/apiSlice";
import { setUserChatOptions, toggleProfile } from "../api/globalSlice";
import { authSlice } from "../auth/authSlice";
import { messagesAdapter } from "../chats/chatSlice";

export interface setInterface {
  control: "archivedChats" | "blockedUsers" | "mutedUsers";
  set: boolean;
  userId: string;
}

export const settingsSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    setChatInfo: builder.mutation<unknown, setInterface>({
      query: ({ userId, set, control }) => ({
        url: `chatsettings/setinfo/${userId}`,
        method: 'POST',
        body: { control: (control as string), set }
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        dispatch(setUserChatOptions(arg));
        const patchedUser = dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const user = draft.entities[arg.userId];
          if (user) {
            switch (arg.control) {
              case "archivedChats":
                user.isArchived = arg.set;
                break;
              case "blockedUsers":
                user.isBlocked = arg.set;
                break;
              case "mutedUsers":
                user.isMuted = arg.set;
                break;
              default:
                break;
            }
          }
        }));
        try {
          await queryFulfilled;
        } catch (err) { patchedUser.undo(); dispatch(setUserChatOptions({ ...arg, set: !arg.set })); }
      }
    }),
    clearChat: builder.mutation<unknown, { messageIds: string[], to: string; }>({
      query: body => ({
        url: 'message/clearchat',
        method: 'DELETE',
        body: { ...body }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchedUser = dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const user = draft.entities[arg.to];
          if (user) {
            user.messages = [];
            user.unread = [];
          }
        }));
        dispatch(toggleProfile(false));
        try {
          await queryFulfilled;
          messagesAdapter.removeMany(messagesAdapter.getInitialState(), arg.messageIds);
          dispatch(apiSlice.util.invalidateTags([{ type: 'Messages' as const, id: arg.to }]));
        } catch (err) { patchedUser.undo(); }
      }
    })
  })
});

export const { useSetChatInfoMutation, useClearChatMutation } = settingsSlice;