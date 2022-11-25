import { createEntityAdapter, createSelector, EntityId, EntityState } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { messageInterface } from "../../utilities/interfaces";
import { apiSlice } from "../api/apiSlice";
import { recieveMsgFromSocket, sendMsgThroughSocket } from "../api/globalSlice";

export const messagesAdapter = createEntityAdapter<messageInterface>({});
const initialState = messagesAdapter.getInitialState();

export const chatSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendMessage: builder.mutation<messageInterface, { message: string, to: string; }>({
      query: body => ({
        url: 'message/addmsg',
        method: 'POST',
        body: { ...body }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        const socketData = { ...result.data, to: arg.to };
        messagesAdapter.addOne(initialState, result.data);
        dispatch(apiSlice.util.invalidateTags([{ type: 'Messages' as const, id: 'LIST' }]));
        dispatch(sendMsgThroughSocket(socketData));
      }
    }),
    getMessages: builder.query<EntityState<messageInterface>, EntityId>({
      query: to => `message/getmsg/${to}`,
      transformResponse: (res: messageInterface[]) => {
        return messagesAdapter.setAll(initialState, res);
      },
      async onCacheEntryAdded(arg, { dispatch, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded;
          dispatch(recieveMsgFromSocket());
          await cacheEntryRemoved;
        } catch (err) { console.log(err); }
      },
      providesTags: (result, error, arg) => result ? [{ type: 'Messages' as const, id: 'LIST' }, ...result.ids.map(id => ({ type: 'Messages' as const, id }))] : [{ type: 'Messages' as const, id: 'LIST' }]
    }),
  })
});

export const getSelectors = (to: EntityId) => {
  const selectMessagesResult = chatSlice.endpoints.getMessages.select(to);
  const selectMessagesData = createSelector(selectMessagesResult, result => result.data);
  const selectors = messagesAdapter.getSelectors<RootState>(state => selectMessagesData(state) ?? initialState);
  return {
    selectMessageIds: selectors.selectIds,
    selectMessagesById: selectors.selectById
  };
};
export const {
  useSendMessageMutation,
  useLazyGetMessagesQuery
} = chatSlice;