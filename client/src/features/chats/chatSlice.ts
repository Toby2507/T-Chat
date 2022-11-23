import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

export interface messageInterface {
  id: string,
  fromSelf: boolean,
  message: string;
}

const messagesAdapter = createEntityAdapter<messageInterface>({});
const initialState = messagesAdapter.getInitialState();

export const chatSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendMessage: builder.mutation({
      query: body => ({
        url: 'message/addmsg',
        method: 'POST',
        body: { ...body }
      })
    }),
    getMessages: builder.query<EntityState<messageInterface>, EntityId>({
      query: to => `message/getmsg/${to}`,
      transformResponse: (res: messageInterface[]) => {
        return messagesAdapter.setAll(initialState, res);
      },
      providesTags: (result, error, arg) => result ? [{ type: 'Users' as const, id: 'LIST' }, ...result.ids.map(id => ({ type: 'Users' as const, id }))] : [{ type: 'Users' as const, id: 'LIST' }]
    })
  })
});

export const selectAllMessages = (state: RootState, to: EntityId) => chatSlice.endpoints.getMessages.select(to)(state)?.data ?? initialState;
export const {
  useSendMessageMutation,
  useLazyGetMessagesQuery
} = chatSlice;