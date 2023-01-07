import { EntityId, EntityState, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { messageInterface } from "../../utilities/interfaces";
import { apiSlice } from "../api/apiSlice";
import { sendMsgThroughSocket } from "../api/globalSlice";
import { authSlice } from "../auth/authSlice";

export const messagesAdapter = createEntityAdapter<messageInterface>({
  selectId: message => message.id
});
const initialState = messagesAdapter.getInitialState();

export const chatSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendMessage: builder.mutation<messageInterface, { message: string, to: string; }>({
      query: body => ({
        url: 'message/addmsg',
        method: 'POST',
        body: { ...body }
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        messagesAdapter.addOne(initialState, result.data);
        const from = (getState() as RootState).user.user?._id;
        const socketData = { ...result.data, to: arg.to, from, fromSelf: false };
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const user = draft.entities[arg.to];
          if (user) {
            const newMessages = [...user.messages];
            newMessages.push(result.data.id);
            user.messages = newMessages;
            user.lastUpdated = result.data.datetime;
          }
        }));
        dispatch(apiSlice.util.invalidateTags([{ type: 'Messages' as const, id: arg.to }]));
        dispatch(sendMsgThroughSocket(socketData));
      }
    }),
    getMessages: builder.query<EntityState<messageInterface>, EntityId>({
      query: to => `message/getmsg/${to}`,
      transformResponse: (res: messageInterface[]) => {
        return messagesAdapter.upsertMany(initialState, res);
      },
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        const messageIds = [...result.data.ids];
        const messages = { ...result.data.entities };
        let unreadMsgs: EntityId[] = [];
        const me = (getState() as RootState).user.user?._id;
        Object.values(messages).forEach(msg => {
          if (msg && !msg.fromSelf && !msg.read && !msg.readers.includes(me as string)) {
            unreadMsgs.push(msg.id);
          }
        });
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const user = draft.entities[arg];
          if (user) {
            let newMessages = [...user.messages];
            messageIds.forEach(id => { !newMessages.includes(id) && newMessages.push(id); });
            user.messages = newMessages;
            unreadMsgs = unreadMsgs.filter(id => !user.unread.includes(id));
            user.unread = [...user.unread, ...unreadMsgs];
            user.lastUpdated = Math.max(...newMessages.map(id => (messages[id]?.datetime as number)));
          }
        }));
      },
      providesTags: (result, error, arg) => result ? [{ type: 'Messages' as const, id: arg }, ...result.ids.map(id => ({ type: 'Messages' as const, id }))] : [{ type: 'Messages' as const, id: arg }]
    }),
    readMessages: builder.query<{}, { messages: EntityId[], chat: EntityId; }>({
      query: ({ messages, chat }) => ({
        url: 'message/readmsgs',
        method: 'PATCH',
        body: { messages, to: chat }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const reading = dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const user = draft.entities[arg.chat];
          if (user) user.unread = [];
        }));
        queryFulfilled.catch(reading.undo);
      }
    })
  })
});

export const messageSelectors = (to: EntityId) => {
  const messageResult = chatSlice.endpoints.getMessages.select(to);
  const selectMessageData = createSelector(messageResult, result => result.data);
  const selector = messagesAdapter.getSelectors<RootState>(state => selectMessageData(state) ?? initialState);
  return { selectIds: selector.selectIds, selectAll: selector.selectAll, selectById: selector.selectById };
};
export const {
  useSendMessageMutation,
  useLazyGetMessagesQuery,
  useReadMessagesQuery
} = chatSlice;