import { apiSlice } from "../api/apiSlice";
import { setUserChatOptions } from "../api/globalSlice";
import { authSlice } from "../auth/authSlice";

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
        } catch (err) { patchedUser.undo(); }
      }
    })
  })
});

export const { useSetChatInfoMutation } = settingsSlice;