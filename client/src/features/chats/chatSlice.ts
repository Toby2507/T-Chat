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
    sendMessage: builder.mutation<messageInterface, { message: string, to: string, members?: string[]; isInformational?: boolean; }>({
      query: body => ({
        url: 'message/addmsg',
        method: 'POST',
        body: { ...body }
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        messagesAdapter.addOne(initialState, result.data);
        const from = (getState() as RootState).user.user?._id;
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const user = draft.entities[arg.to];
          if (user) {
            const newMessages = [...user.messages];
            newMessages.push({ id: result.data.id, isInformational: result.data.isInformational });
            user.messages = newMessages;
            user.lastUpdated = result.data.datetime;
          }
        }));
        dispatch(apiSlice.util.invalidateTags([{ type: 'Messages' as const, id: arg.to }]));
        if (arg.members) {
          arg.members.forEach(member => {
            if (member !== from) {
              const socketData = { ...result.data, to: member, from: arg.to, fromSelf: false };
              dispatch(sendMsgThroughSocket(socketData));
            }
          });
        } else {
          const socketData = { ...result.data, to: arg.to, from, fromSelf: false };
          dispatch(sendMsgThroughSocket(socketData));
        }
      }
    }),
    getMessages: builder.query<EntityState<messageInterface>, { to: EntityId, isGroup: boolean; }>({
      query: ({ to, isGroup }) => ({
        url: `message/getmsg/${to}`,
        method: 'POST',
        body: { isGroup }
      }),
      transformResponse: (res: messageInterface[]) => {
        return messagesAdapter.upsertMany(initialState, res);
      },
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        const messages = { ...result.data.entities };
        let unreadMsgs: EntityId[] = [];
        const me = (getState() as RootState).user.user?._id;
        Object.values(messages).forEach(msg => {
          if (msg && !msg.fromSelf && !msg.read && !msg.isInformational && !msg.readers.includes(me as string)) {
            unreadMsgs.push(msg.id);
          }
        });
        dispatch(authSlice.util.updateQueryData('getUsers', undefined, draft => {
          const user = draft.entities[arg.to];
          if (user) {
            const msgs = Object.values(messages).map(message => ({ id: message?.id as string, isInformational: message?.isInformational as boolean }));
            let newMessages = [...user.messages];
            const userMsgIds = newMessages.map(msg => msg.id);
            msgs.forEach(msg => { !userMsgIds.includes(msg.id) && newMessages.push(msg); });
            user.messages = newMessages;
            unreadMsgs = unreadMsgs.filter(id => !user.unread.includes(id));
            user.unread = [...user.unread, ...unreadMsgs];
            user.lastUpdated = Math.max(...newMessages.map(msg => (messages[msg.id]?.datetime as number)));
          }
        }));
      },
      providesTags: (result, error, arg) => result ? [{ type: 'Messages' as const, id: arg.to }, ...result.ids.map(id => ({ type: 'Messages' as const, id }))] : [{ type: 'Messages' as const, id: arg.to }]
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

export const messageSelectors = (to: EntityId, isGroup: boolean) => {
  const messageResult = chatSlice.endpoints.getMessages.select({ to, isGroup });
  const selectMessageData = createSelector(messageResult, result => result.data);
  const selector = messagesAdapter.getSelectors<RootState>(state => selectMessageData(state) ?? initialState);
  return { selectIds: selector.selectIds, selectAll: selector.selectAll, selectById: selector.selectById };
};
export const {
  useSendMessageMutation,
  useLazyGetMessagesQuery,
  useReadMessagesQuery
} = chatSlice;